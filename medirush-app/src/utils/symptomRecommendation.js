export const getSymptomRecommendation = (symptom) => {
  if (!symptom) return null;
  
  const lowercaseSym = symptom.toLowerCase();
  const severeSymptoms = ['breathing', 'chest pain', 'injury', 'heart', 'bleeding', 'severe'];
  const isSevere = severeSymptoms.some(s => lowercaseSym.includes(s));

  if (isSevere) {
    return {
      suggestedType: "Hospital",
      requireEmergency: true,
      message: "Priority matching for Hospitals with Emergency Support.",
      warning: "This is not a medical diagnosis. For serious symptoms, visit the nearest hospital or call emergency services immediately."
    };
  }

  if (lowercaseSym.includes('weakness') || lowercaseSym.includes('allergy') || lowercaseSym.includes('stomach')) {
    return {
      suggestedType: "Clinic",
      requireEmergency: false,
      message: "Priority matching for Clinics.",
      warning: "These are suggestions only. Consult a doctor if symptoms persist."
    };
  }

  // Default to Pharmacy for minor things (fever, headache, cold)
  return {
    suggestedType: "Pharmacy",
    requireEmergency: false,
    message: "Priority matching for Pharmacies.",
    warning: "These are suggestions only. Consult a doctor if symptoms persist."
  };
};
