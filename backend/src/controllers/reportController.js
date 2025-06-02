// backend/src/controllers/reportController.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Report = require('../models/Report');
const Submission = require('../models/Submission');
const Student = require('../models/Student');

exports.generateReport = async (req, res) => {
  const { studentId, course, remarks } = req.body;

  try {
    const student = await Student.findById(studentId);
    const totalTasks = await Submission.countDocuments({ student: studentId });
    const completedTasks = await Submission.countDocuments({ student: studentId, reviewStatus: 'Satisfied' });

    let percentage = 0;
    if (totalTasks > 0) {
      percentage = (completedTasks / totalTasks) * 100;
    }

    let grade = 'F';
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 45) grade = 'D';

    // Optionally, if totalTasks == 0, you can assign grade 'N/A' or 'Incomplete'
    if (totalTasks === 0) {
      grade = 'N/A';  // or keep 'F' but make sure frontend handles this gracefully
    }


    // Generate certificate PDF
    const certName = `${student.name.replace(/ /g, '_')}_certificate.pdf`;
    const certPath = path.join('certificates', certName);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(certPath));
    doc.fontSize(24).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Awarded to: ${student.name}`);
    doc.text(`Course: ${course}`);
    doc.text(`Grade: ${grade}`);
    doc.text(`Performance: ${completedTasks} / ${totalTasks} tasks`);
    doc.text(`Remarks: ${remarks}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.end();

    const report = await Report.create({
      student: studentId,
      course,
      totalTasks,
      completedTasks,
      grade,
      performanceRemarks: remarks,
      certificateUrl: `/api/reports/certificate/${certName}`
    });

    res.status(201).json({ message: 'Report generated', report });
  } catch (err) {
    res.status(500).json({ message: 'Error generating report', error: err.message });
  }
};

exports.downloadCertificate = (req, res) => {
  const fileName = req.params.file;
  const certPath = path.join(__dirname, '../../certificates', fileName);
  if (!fs.existsSync(certPath)) return res.status(404).json({ message: 'Certificate not found' });

  res.download(certPath);
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('student');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
};



exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the report to get the certificate filename for deleting the file
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Delete certificate PDF file if exists
    const certFilePath = report.certificateUrl ? report.certificateUrl.replace('/api/reports/certificate/', '') : null;
    if (certFilePath) {
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(__dirname, '../../certificates', certFilePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // delete the certificate file
      }
    }

    await Report.findByIdAndDelete(id);
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting report', error: err.message });
  }
};

