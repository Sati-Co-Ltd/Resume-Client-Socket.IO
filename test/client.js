const ResumeClient = new (require('resume-node-rest-connector').HttpClient)('https://resume.sati.co.th');

// Test ResumeClient
ResumeClient.testAnonymous();