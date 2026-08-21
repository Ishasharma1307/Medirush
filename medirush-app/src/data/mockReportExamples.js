export const mockReportExamples = {
  bloodTest: `PATIENT REPORT: COMPLETE BLOOD COUNT (CBC) & IRON PANEL
--------------------------------------------------------
Test Parameter           Result      Unit         Reference Range   Status
Hemoglobin (Hb)          9.2         g/dL         12.0 - 15.5       LOW
RBC Count                3.4         x10^6/uL     4.0 - 5.2         LOW
WBC Count                11.8        x10^3/uL     4.5 - 11.0        HIGH
Platelet Count           210         x10^3/uL     150 - 450         NORMAL
Serum Ferritin           12          ng/mL        20 - 200          LOW
MCV                      72          fL           80 - 100          LOW

IMPRESSION: Microcytic Hypochromic Anemia with mild Leukocytosis. Low iron stores.`,

  lft: `PATIENT REPORT: LIVER FUNCTION TEST (LFT) & ENZYMES
---------------------------------------------------
Test Parameter           Result      Unit         Reference Range   Status
SGPT (ALT)               145         U/L          7 - 56            HIGH
SGOT (AST)               98          U/L          8 - 48            HIGH
Total Bilirubin          2.4         mg/dL        0.2 - 1.2         HIGH
Direct Bilirubin         0.9         mg/dL        0.0 - 0.3         HIGH
Alkaline Phosphatase     210         U/L          44 - 147          HIGH
Serum Albumin            4.1         g/dL         3.5 - 5.0         NORMAL

IMPRESSION: Hepatocellular Injury with Jaundice features. Suggestive of Grade 2 Fatty Liver or Viral Hepatitis.`,

  kft: `PATIENT REPORT: KIDNEY FUNCTION TEST (KFT) & RENAL PANEL
-------------------------------------------------------
Test Parameter           Result      Unit         Reference Range   Status
Serum Creatinine         2.4         mg/dL        0.7 - 1.3         HIGH
Blood Urea Nitrogen (BUN) 42         mg/dL        7 - 20            HIGH
Uric Acid                8.9         mg/dL        3.5 - 7.2         HIGH
eGFR                     34          mL/min       > 90              LOW
Serum Sodium (Na)        138         mEq/L        135 - 145         NORMAL
Serum Potassium (K)      5.3         mEq/L        3.5 - 5.0         HIGH

IMPRESSION: Impaired Renal Function (Stage 3 Chronic Kidney Disease / Acute Kidney Injury). Hyperuricemia.`,

  lipid: `PATIENT REPORT: LIPID PROFILE & CARDIAC RISK PANEL
---------------------------------------------------
Test Parameter           Result      Unit         Reference Range   Status
Total Cholesterol        265         mg/dL        < 200             HIGH
Triglycerides            240         mg/dL        < 150             HIGH
LDL (Bad Cholesterol)    175         mg/dL        < 100             HIGH
HDL (Good Cholesterol)   34          mg/dL        > 40              LOW
VLDL                     48          mg/dL        < 30              HIGH

IMPRESSION: Mixed Dyslipidemia. High risk for Atherosclerosis and Coronary Artery Disease.`,

  diabetes: `PATIENT REPORT: DIABETES & HbA1c PANEL
----------------------------------------
Test Parameter           Result      Unit         Reference Range   Status
HbA1c (Glycated Hb)      8.4         %            < 5.7             HIGH
Fasting Blood Sugar      168         mg/dL        70 - 99           HIGH
Post Prandial Glucose    235         mg/dL        < 140             HIGH
Urine Ketones            Negative    --           Negative          NORMAL

IMPRESSION: Uncontrolled Type 2 Diabetes Mellitus with High Glycemic Burden.`,

  thyroid: `PATIENT REPORT: THYROID FUNCTION TEST (T3, T4, TSH)
---------------------------------------------------
Test Parameter           Result      Unit         Reference Range   Status
TSH (Serum)              8.9         mIU/L        0.4 - 4.5         HIGH
Total T3                 0.65        ng/mL        0.8 - 2.0         LOW
Total T4                 4.2         ug/dL        5.1 - 14.1        LOW

IMPRESSION: Primary Hypothyroidism. Thyroid Gland Underactivity.`,

  emergency: `PATIENT EMERGENCY REPORT: CARDIOLOGY & TROPONIN I
---------------------------------------------------
Test Parameter           Result      Unit         Reference Range   Status
Troponin I               4.8         ng/mL        < 0.04            CRITICAL
ECG Finding              ST Elevation in V1-V4 --  Normal Sinus      CRITICAL
Blood Pressure           165/105     mmHg         120/80            HIGH

IMPRESSION: ACUTE ANTERIOR WALL MYOCARDIAL INFARCTION (HEART ATTACK). IMMEDIATE EMERGENCY ADMISSION REQUIRED.`
};
