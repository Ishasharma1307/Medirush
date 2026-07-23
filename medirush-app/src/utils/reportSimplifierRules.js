export const simplifyReport = (text) => {
  const lowerText = text.toLowerCase();
  
  let is_emergency = false;
  let summary = "This report shows some laboratory or medical findings. Please review the details below.";
  let important_terms = [];
  let questions_for_doctor = ["What does this result mean for my overall health?", "Do I need any lifestyle changes or medications?"];
  
  // Emergency checks
  const emergencyKeywords = ['heart attack', 'stroke', 'severe infection', 'kidney failure', 'cancer', 'critical', 'emergency', 'infarction'];
  for (const keyword of emergencyKeywords) {
    if (lowerText.includes(keyword)) {
      is_emergency = true;
      summary = "This report contains critical medical terms that may require immediate attention.";
      questions_for_doctor.unshift("Is this an emergency?");
      break;
    }
  }

  // Basic parsing rules
  if (lowerText.includes('hemoglobin') || lowerText.includes('anemia')) {
    summary = "This is a blood test report. It looks like it is checking for Anemia (low red blood cell count).";
    important_terms.push({ term: "Hemoglobin", meaning: "A protein in red blood cells that carries oxygen." });
    important_terms.push({ term: "Anemia", meaning: "A condition where you lack enough healthy red blood cells." });
    if (lowerText.includes('low')) questions_for_doctor.push("Should I take iron supplements?");
  }

  if (lowerText.includes('tsh') || lowerText.includes('thyroid')) {
    summary = "This is a thyroid function test. It measures how well your thyroid gland is working.";
    important_terms.push({ term: "TSH", meaning: "Thyroid Stimulating Hormone. It tells your thyroid to make hormones." });
    important_terms.push({ term: "Hypothyroidism", meaning: "Underactive thyroid, meaning it doesn't make enough hormones." });
  }

  if (lowerText.includes('glucose') || lowerText.includes('hba1c') || lowerText.includes('diabetes')) {
    summary = "This report is checking your blood sugar levels, often used to monitor or diagnose Diabetes.";
    important_terms.push({ term: "Glucose (Fasting)", meaning: "Your blood sugar level after not eating for several hours." });
    important_terms.push({ term: "HbA1c", meaning: "Your average blood sugar level over the past 2-3 months." });
    if (lowerText.includes('high')) questions_for_doctor.push("Do I need to change my diet to control my blood sugar?");
  }
  
  if (important_terms.length === 0 && !is_emergency) {
    summary = "We couldn't identify specific common conditions in this text. Please consult your doctor for a detailed explanation.";
    important_terms.push({ term: "General Findings", meaning: "The specific medical terms used in this text require professional interpretation." });
  }

  return {
    summary,
    important_terms,
    questions_for_doctor,
    is_emergency
  };
};
