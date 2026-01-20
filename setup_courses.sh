#!/bin/bash

# Run from root of HTML_ORGANIZATION_DASHBOARD repo
# Usage: bash setup_courses.sh

set -e

echo "Creating course data structure for Spring 2026..."

# Create directories
mkdir -p data/courses/EPS_607
mkdir -p data/courses/EPS_609
mkdir -p data/courses/EPS_706
mkdir -p data/courses/EPS_737
mkdir -p data/courses/EPS_740

# EPS 607 - School-Based Interventions
cat > data/courses/EPS_607/course.json << 'EOF'
{
  "course_id": "EPS_607",
  "title": "School-Based Interventions",
  "instructor": {
    "name": "Kathy J. Bohan, Ed.D., NCSP (Ret)",
    "email": "Kathy.bohan@nau.edu",
    "office": "Eastburn Education Bldg. 27, Office 206M",
    "office_hours": "Mondays & Thursdays 10:00am-12:00pm or by appointment"
  },
  "credits": 3,
  "meeting": {
    "day": "Monday",
    "start": "16:00",
    "end": "18:30",
    "location": "Eastburn Education, Room 124"
  },
  "semester": {
    "term": "Spring",
    "year": 2026,
    "start": "2026-01-12",
    "end": "2026-05-08"
  },
  "format": "In-Person",
  "description": "This course will increase students' knowledge of components of effective interventions that promote development and academic progress for school-aged children. Models and methods of data collection, decision-making, progress monitoring, and evaluation of outcomes will be discussed. Programs that promote P-12 students' mental health will also be addressed."
}
EOF

cat > data/courses/EPS_607/assignments.json << 'EOF'
{
  "course_id": "EPS_607",
  "total_points": 300,
  "assignments": [
    {
      "id": "607_reading_presentation",
      "title": "Group Presentation: Big 5 Reading Components & Evidence-based Interventions",
      "type": "presentation",
      "due_date": "2026-02-09",
      "points": 40,
      "weight": 13.3,
      "description": "20-minute group presentation on one of five reading components."
    },
    {
      "id": "607_reading_collaboration",
      "title": "Reading Intervention Collaboration Experience",
      "type": "practicum",
      "due_date": "2026-04-27",
      "points": 40,
      "weight": 13.3,
      "description": "Collaborate with SLP graduate student on reading intervention."
    },
    {
      "id": "607_workshop_orientation",
      "title": "Collaborative Workshop Orientation",
      "type": "participation",
      "due_date": "2026-01-28",
      "points": 10,
      "weight": 3.3,
      "project_group": "collaborative_workshops"
    },
    {
      "id": "607_workshop_presentation",
      "title": "Collaborative Workshop Presentation",
      "type": "presentation",
      "due_date": null,
      "points": 30,
      "weight": 10.0,
      "project_group": "collaborative_workshops"
    },
    {
      "id": "607_participation_journal",
      "title": "Participation in Discussion and Activities",
      "type": "participation",
      "due_date": "2026-05-04",
      "points": 30,
      "weight": 10.0,
      "recurring": true
    },
    {
      "id": "607_video_reflection",
      "title": "Video Reflections on Reading Difficulties and Dyslexia",
      "type": "paper",
      "due_date": "2026-03-16",
      "points": 30,
      "weight": 10.0
    },
    {
      "id": "607_math_writing_presentation",
      "title": "Group Presentation: Math or Writing EBI",
      "type": "presentation",
      "due_date": "2026-03-23",
      "points": 40,
      "weight": 13.3
    },
    {
      "id": "607_single_case_design",
      "title": "Single Case Design Graph & Interpretation",
      "type": "paper",
      "due_date": "2026-03-02",
      "points": 30,
      "weight": 10.0
    },
    {
      "id": "607_pbis_scenario",
      "title": "School-wide PBIS Scenario",
      "type": "paper",
      "due_date": "2026-04-13",
      "points": 20,
      "weight": 6.7
    },
    {
      "id": "607_pra_case_study",
      "title": "PRA: Academic Intervention Case Study",
      "type": "paper",
      "due_date": "2026-04-20",
      "points": 30,
      "weight": 10.0,
      "is_pra": true
    }
  ]
}
EOF

cat > data/courses/EPS_607/schedule.json << 'EOF'
{
  "course_id": "EPS_607",
  "schedule": [
    {"week": 1, "date": "2026-01-12", "topics": ["Course Introduction", "MTSS/RTI/PBIS Framework"], "due": []},
    {"week": 2, "date": "2026-01-19", "topics": [], "due": [], "notes": "MLK Day - No Class"},
    {"week": 3, "date": "2026-01-26", "topics": ["Reading Instruction: Big 5 Components"], "due": []},
    {"week": 4, "date": "2026-02-02", "topics": ["Literacy Screenings, Assessments"], "due": ["607_workshop_orientation"]},
    {"week": 5, "date": "2026-02-09", "topics": ["Big 5 Reading Group Presentations"], "due": ["607_reading_presentation"]},
    {"week": 6, "date": "2026-02-16", "topics": ["Single-Case Design: Graphing Basics"], "due": []},
    {"week": 7, "date": "2026-02-23", "topics": [], "due": [], "notes": "NASP Convention - No Class"},
    {"week": 8, "date": "2026-03-02", "topics": ["Intervention Planning"], "due": ["607_single_case_design"]},
    {"week": 9, "date": "2026-03-09", "topics": [], "due": [], "notes": "Spring Break"},
    {"week": 10, "date": "2026-03-16", "topics": ["Single-Case Design Deep Dive", "Dyslexia"], "due": ["607_video_reflection"]},
    {"week": 11, "date": "2026-03-23", "topics": ["Math/Writing Presentations"], "due": ["607_math_writing_presentation"]},
    {"week": 12, "date": "2026-03-30", "topics": ["MTSS/PBIS Tier 1 & 2"], "due": []},
    {"week": 13, "date": "2026-04-06", "topics": ["MTSS/PBIS Tier 3"], "due": []},
    {"week": 14, "date": "2026-04-13", "topics": ["Collaboration Seminar"], "due": ["607_pbis_scenario"]},
    {"week": 15, "date": "2026-04-20", "topics": ["Maintenance & Generalization"], "due": ["607_pra_case_study"]},
    {"week": 16, "date": "2026-04-27", "topics": ["Putting it All Together"], "due": ["607_reading_collaboration"]},
    {"week": 17, "date": "2026-05-04", "topics": [], "due": ["607_participation_journal"], "notes": "Finals Week"}
  ]
}
EOF

cat > data/courses/EPS_607/courserequirements.json << 'EOF'
{
  "course_id": "EPS_607",
  "required_materials": [
    {"type": "textbook", "title": "RTI Applications Volume 1", "authors": ["Burns, M. K.", "Riley-Tillman, T. C.", "Van Der Heyden, A. M."], "year": 2012, "availability": "NAU Library e-book"},
    {"type": "textbook", "title": "RTI Applications Volume 2", "authors": ["Riley-Tillman, T. C.", "Burns, M. K.", "Gibbons, K."], "year": 2013, "availability": "NAU Library e-book"}
  ],
  "grading": {
    "scale": {"A": {"min": 90}, "B": {"min": 80}, "C": {"min": 70}, "D": {"min": 60}, "F": {"min": 0}},
    "total_points": 300
  },
  "policies": {
    "late_work": {"next_class": "50% reduction", "after_following_class": "Not accepted"}
  }
}
EOF

# EPS 609 - Cognition and Affect
cat > data/courses/EPS_609/course.json << 'EOF'
{
  "course_id": "EPS_609",
  "title": "Cognition and Affect",
  "instructor": {
    "name": "Alana Kennedy, Ph.D.",
    "email": "alana.kennedy@nau.edu",
    "office": "Eastburn Education 209B",
    "office_hours": "Wednesdays 11:30am-12:30pm at Scholars Corner or by appointment"
  },
  "credits": 3,
  "meeting": {
    "day": "Wednesday",
    "start": "09:00",
    "end": "11:30",
    "location": "Eastburn Education Building, Room 124"
  },
  "semester": {
    "term": "Spring",
    "year": 2026,
    "start": "2026-01-14",
    "end": "2026-04-29"
  },
  "format": "Face-to-Face",
  "description": "Cognitive and affective psychological theories to understand how learning, problem-solving and decision-making take place."
}
EOF

cat > data/courses/EPS_609/assignments.json << 'EOF'
{
  "course_id": "EPS_609",
  "total_points": 1130,
  "assignments": [
    {"id": "609_praxis_1", "title": "Praxis Activity 1", "type": "practicum", "due_date": "2026-01-28", "points": 50, "weight": 5.0},
    {"id": "609_exam_1", "title": "Exam 1", "type": "exam", "due_date": "2026-02-01", "points": 100, "weight": 7.5, "project_group": "cognitive_exams"},
    {"id": "609_insight_1", "title": "Insight Paper 1", "type": "paper", "due_date": "2026-02-01", "points": 50, "weight": 5.0},
    {"id": "609_lit_review_abstract", "title": "Literature Review Abstract", "type": "paper", "due_date": "2026-02-08", "points": 20, "project_group": "literature_review"},
    {"id": "609_exam_2", "title": "Exam 2", "type": "exam", "due_date": "2026-02-15", "points": 100, "weight": 7.5, "project_group": "cognitive_exams"},
    {"id": "609_insight_2", "title": "Insight Paper 2", "type": "paper", "due_date": "2026-02-15", "points": 50, "weight": 5.0},
    {"id": "609_lit_review_outline", "title": "Literature Review Outline", "type": "paper", "due_date": "2026-02-22", "points": 20, "project_group": "literature_review"},
    {"id": "609_lit_review_draft", "title": "Literature Review Draft", "type": "paper", "due_date": "2026-03-08", "points": 30, "project_group": "literature_review"},
    {"id": "609_lit_review_peer", "title": "Literature Review Peer Feedback", "type": "participation", "due_date": "2026-03-18", "points": 30, "project_group": "literature_review"},
    {"id": "609_exam_3", "title": "Exam 3", "type": "exam", "due_date": "2026-03-22", "points": 100, "weight": 7.5, "project_group": "affective_exams"},
    {"id": "609_insight_3", "title": "Insight Paper 3", "type": "paper", "due_date": "2026-03-22", "points": 50, "weight": 5.0},
    {"id": "609_exam_4", "title": "Exam 4", "type": "exam", "due_date": "2026-04-05", "points": 100, "weight": 7.5, "project_group": "affective_exams"},
    {"id": "609_insight_4", "title": "Insight Paper 4", "type": "paper", "due_date": "2026-04-05", "points": 50, "weight": 5.0},
    {"id": "609_lit_review_final", "title": "Literature Review - Final", "type": "paper", "due_date": "2026-04-12", "points": 250, "weight": 20.0},
    {"id": "609_lit_review_presentation", "title": "Literature Review Presentation", "type": "presentation", "due_date": "2026-04-15", "points": 0},
    {"id": "609_course_reflection", "title": "Course Reflection", "type": "paper", "due_date": "2026-04-29", "points": 100, "weight": 10.0},
    {"id": "609_participation", "title": "In-Class Work and Participation", "type": "participation", "due_date": "2026-04-29", "points": 130, "weight": 15.0, "recurring": true}
  ]
}
EOF

cat > data/courses/EPS_609/schedule.json << 'EOF'
{
  "course_id": "EPS_609",
  "schedule": [
    {"week": 1, "date": "2026-01-14", "topics": ["Foundations of Cognition and Affect"], "due": []},
    {"week": 2, "date": "2026-01-21", "topics": ["Memory: Information Processing"], "due": []},
    {"week": 3, "date": "2026-01-28", "topics": ["Memory: Storage, Encoding, Retrieval"], "due": ["609_praxis_1"]},
    {"week": 4, "date": "2026-02-04", "topics": ["Nature of Knowledge and Knowing"], "due": []},
    {"week": 5, "date": "2026-02-11", "topics": ["Concepts, Conceptual Change"], "due": []},
    {"week": 6, "date": "2026-02-18", "topics": ["Problem Solving, Critical Thinking"], "due": []},
    {"week": 7, "date": "2026-02-25", "topics": ["Transfer"], "due": []},
    {"week": 8, "date": "2026-03-04", "topics": ["Emotions and Learning"], "due": []},
    {"week": 9, "date": "2026-03-11", "topics": [], "due": [], "notes": "Spring Break"},
    {"week": 10, "date": "2026-03-18", "topics": ["Peer Review Workshop"], "due": ["609_lit_review_peer"]},
    {"week": 11, "date": "2026-03-25", "topics": ["Motivation and Affect"], "due": []},
    {"week": 12, "date": "2026-04-01", "topics": ["Self-Regulation"], "due": []},
    {"week": 13, "date": "2026-04-08", "topics": ["Attributions and Achievement Goals"], "due": []},
    {"week": 14, "date": "2026-04-15", "topics": ["Literature Review Presentations"], "due": ["609_lit_review_presentation"]},
    {"week": 15, "date": "2026-04-22", "topics": ["Course Reflection Presentations"], "due": []},
    {"week": 16, "date": "2026-04-29", "topics": ["Course Reflection Presentations"], "due": ["609_course_reflection"]}
  ]
}
EOF

cat > data/courses/EPS_609/courserequirements.json << 'EOF'
{
  "course_id": "EPS_609",
  "required_materials": [
    {"type": "textbook", "title": "Human Learning", "authors": ["Ormrod, J. E."], "year": 2020, "edition": "8th"}
  ],
  "grading": {
    "scale": {"A": {"min": 90}, "B": {"min": 80}, "C": {"min": 70}, "D": {"min": 60}, "F": {"min": 0}},
    "total_points": 1130
  },
  "doctoral_requirements": {
    "cognitive_basis": {"exams": ["Exam 1", "Exam 2"], "minimum_average": 80},
    "affective_basis": {"exams": ["Exam 3", "Exam 4"], "minimum_average": 80}
  },
  "policies": {
    "late_work": {"deduction": "10% per 24 hours"}
  }
}
EOF

# EPS 706 - History and Systems (temp syllabus)
cat > data/courses/EPS_706/course.json << 'EOF'
{
  "course_id": "EPS_706",
  "title": "History and Systems of Psychology",
  "instructor": {
    "name": "Jeffrey D. Strain, Ph.D.",
    "email": "jeff.strain@nau.edu",
    "office": "Eastburn #143",
    "office_hours": "3:00-4:30 PM Wednesdays, 3:00-5:30 PM Thursdays"
  },
  "credits": 3,
  "meeting": {
    "day": "Wednesday",
    "start": "16:00",
    "end": "18:30",
    "location": "Eastburn Education, Room 208"
  },
  "semester": {"term": "Spring", "year": 2026, "start": "2026-01-14", "end": "2026-05-08"},
  "format": "In-Person",
  "syllabus_status": "temp_syllabus"
}
EOF

cat > data/courses/EPS_706/assignments.json << 'EOF'
{
  "course_id": "EPS_706",
  "total_points": null,
  "syllabus_status": "temp_syllabus",
  "assignments": [
    {"id": "706_article_review_1", "title": "Article Deep Dive #1", "type": "presentation", "due_date": "2026-01-21", "points": null},
    {"id": "706_article_review_2", "title": "Article Deep Dive #2", "type": "presentation", "due_date": "2026-02-04", "points": null},
    {"id": "706_article_review_3", "title": "Article Deep Dive #3", "type": "presentation", "due_date": "2026-03-04", "points": null},
    {"id": "706_final_paper", "title": "Final Paper (25 pages)", "type": "paper", "due_date": null, "points": null}
  ]
}
EOF

cat > data/courses/EPS_706/schedule.json << 'EOF'
{
  "course_id": "EPS_706",
  "syllabus_status": "temp_syllabus",
  "schedule": [
    {"week": 1, "date": "2026-01-14", "topics": ["Course Introduction"], "due": []},
    {"week": 2, "date": "2026-01-21", "topics": ["Article Presentations"], "due": ["706_article_review_1"]},
    {"week": 4, "date": "2026-02-04", "topics": ["Article Presentations"], "due": ["706_article_review_2"]},
    {"week": 8, "date": "2026-03-04", "topics": ["Article Presentations"], "due": ["706_article_review_3"]},
    {"week": 9, "date": "2026-03-11", "topics": [], "due": [], "notes": "Spring Break"}
  ]
}
EOF

cat > data/courses/EPS_706/courserequirements.json << 'EOF'
{
  "course_id": "EPS_706",
  "syllabus_status": "temp_syllabus",
  "required_materials": [{"type": "canvas", "description": "Readings in Canvas"}],
  "grading": {"total_points": null},
  "format_requirements": {"paper_length": "25 pages"}
}
EOF

# EPS 737 - Psychological Assessment
cat > data/courses/EPS_737/course.json << 'EOF'
{
  "course_id": "EPS_737",
  "title": "Psychological Assessment",
  "instructor": {
    "name": "Melanie Whetstine, Ph.D.",
    "email": "Melanie.Whetstine@nau.edu",
    "office": "206i Eastburn Education",
    "office_hours": "Mondays 10:30am-12:30pm"
  },
  "credits": 3,
  "meeting": {
    "day": "Tuesday",
    "start": "12:45",
    "end": "15:15",
    "location": "Eastburn Education Room 205"
  },
  "semester": {"term": "Spring", "year": 2026, "start": "2026-01-12", "end": "2026-05-08"},
  "description": "Psychological assessment for personality assessment. Students learn to select, administer, score, interpret tests and offer feedback."
}
EOF

cat > data/courses/EPS_737/assignments.json << 'EOF'
{
  "course_id": "EPS_737",
  "total_points": 475,
  "assignments": [
    {"id": "737_interview_mse_video", "title": "Clinical Interview/MSE Video", "type": "practicum", "due_date": "2026-02-03", "points": 50, "weight": 10.5, "project_group": "test_administration_project"},
    {"id": "737_intake_report", "title": "Intake Report", "type": "paper", "due_date": "2026-02-03", "points": 50, "weight": 10.5, "project_group": "test_administration_project"},
    {"id": "737_mmpi3_partner_report", "title": "MMPI-3 Interpretive Report (Partner)", "type": "paper", "due_date": "2026-03-17", "points": 50, "weight": 10.5, "project_group": "test_administration_project"},
    {"id": "737_pai_partner_report", "title": "PAI Interpretive Report (Partner)", "type": "paper", "due_date": "2026-03-17", "points": 50, "weight": 10.5, "project_group": "test_administration_project"},
    {"id": "737_mcmi4_partner_report", "title": "MCMI-IV Interpretive Report (Partner)", "type": "paper", "due_date": "2026-03-31", "points": 50, "weight": 10.5, "project_group": "test_administration_project"},
    {"id": "737_feedback_session_video", "title": "Oral Feedback Session Video", "type": "practicum", "due_date": "2026-04-21", "points": 25, "weight": 5.0, "project_group": "test_administration_project"},
    {"id": "737_comprehensive_report", "title": "Comprehensive Evaluation Report", "type": "paper", "due_date": "2026-04-21", "points": 50, "weight": 10.5, "project_group": "test_administration_project"},
    {"id": "737_mmpi3_self_report", "title": "MMPI-3 Self-Assessment Report", "type": "paper", "due_date": "2026-03-17", "points": 25, "weight": 5.3, "project_group": "self_assessment_project"},
    {"id": "737_pai_self_report", "title": "PAI Self-Assessment Report", "type": "paper", "due_date": "2026-03-17", "points": 25, "weight": 5.3, "project_group": "self_assessment_project"},
    {"id": "737_mcmi4_self_report", "title": "MCMI-IV Self-Assessment Report", "type": "paper", "due_date": "2026-03-31", "points": 25, "weight": 5.3, "project_group": "self_assessment_project"},
    {"id": "737_combination_self_report", "title": "Combination Self-Assessment Report", "type": "paper", "due_date": "2026-04-14", "points": 0, "project_group": "self_assessment_project"},
    {"id": "737_case_presentation", "title": "Case Presentation", "type": "presentation", "due_date": null, "date_range": {"start": "2026-04-07", "end": "2026-04-28"}, "points": 75, "weight": 16.0}
  ]
}
EOF

cat > data/courses/EPS_737/schedule.json << 'EOF'
{
  "course_id": "EPS_737",
  "schedule": [
    {"week": 1, "date": "2026-01-13", "topics": ["Intro to Psychological Assessment"], "due": []},
    {"week": 2, "date": "2026-01-20", "topics": ["Clinical Assessment Interview/MSE"], "due": []},
    {"week": 3, "date": "2026-01-27", "topics": ["Personality Disorders Overview"], "due": []},
    {"week": 4, "date": "2026-02-03", "topics": ["MMPI-3: History, Administration, Validity"], "due": ["737_interview_mse_video", "737_intake_report"]},
    {"week": 5, "date": "2026-02-10", "topics": ["MMPI-3: Validity, Substantive Scales"], "due": []},
    {"week": 6, "date": "2026-02-17", "topics": ["MMPI-3: Interpretation, Case Studies"], "due": []},
    {"week": 7, "date": "2026-02-24", "topics": ["Report Writing", "PAI"], "due": []},
    {"week": 8, "date": "2026-03-03", "topics": ["PAI", "Suicide Assessment"], "due": []},
    {"week": 9, "date": "2026-03-10", "topics": [], "due": [], "notes": "Spring Break"},
    {"week": 10, "date": "2026-03-17", "topics": ["MCMI-IV"], "due": ["737_mmpi3_partner_report", "737_pai_partner_report", "737_mmpi3_self_report", "737_pai_self_report"]},
    {"week": 11, "date": "2026-03-24", "topics": ["MCMI-IV cont", "NEO", "TAT"], "due": []},
    {"week": 12, "date": "2026-03-31", "topics": ["Rorschach"], "due": ["737_mcmi4_partner_report", "737_mcmi4_self_report"]},
    {"week": 13, "date": "2026-04-07", "topics": ["Feedback", "Treatment Planning", "Case Presentations"], "due": []},
    {"week": 14, "date": "2026-04-14", "topics": ["Diversity Issues", "Case Presentations"], "due": ["737_combination_self_report"]},
    {"week": 15, "date": "2026-04-21", "topics": ["Case Presentations"], "due": ["737_comprehensive_report", "737_feedback_session_video"]},
    {"week": 16, "date": "2026-04-28", "topics": ["Case Presentations"], "due": []}
  ]
}
EOF

cat > data/courses/EPS_737/courserequirements.json << 'EOF'
{
  "course_id": "EPS_737",
  "required_materials": [
    {"type": "textbook", "title": "Interpreting the MMPI-3", "authors": ["Ben-Porath, Y. S.", "Sellbom, M."], "year": 2024},
    {"type": "textbook", "title": "Essentials of MCMI-IV Assessment", "authors": ["Grossman, S.", "Amendolace, B."], "year": 2017},
    {"type": "textbook", "title": "Handbook of Psychological Assessment", "authors": ["Groth-Marnat, G.", "Wright, A. J."], "year": 2016, "edition": "6th"},
    {"type": "textbook", "title": "Essentials of PAI Assessment", "authors": ["Morey, L. C."], "year": 2003}
  ],
  "grading": {
    "scale": {"A": {"min": 90}, "B": {"min": 80}, "C": {"min": 70}, "D": {"min": 60}, "F": {"min": 0}},
    "total_points": 475,
    "completion_requirement": "All assignments must be completed to pass regardless of grade"
  },
  "policies": {
    "attendance": {"allowed_absences": 1, "penalty": "Additional absences lower letter grade"},
    "late_work": {"0_to_72hrs": "10% reduction", "4_to_7days": "50% reduction", "after_7days": "0"}
  },
  "format_requirements": {"style": "APA 7th", "file_format": ".docx", "spacing": "single-spaced", "signature_required": true}
}
EOF

# EPS 740 - Doctoral Practicum (based on F25 draft)
cat > data/courses/EPS_740/course.json << 'EOF'
{
  "course_id": "EPS_740",
  "title": "Doctoral Practicum in Counseling Psychology and Supervision",
  "instructor": {
    "name": "Jeffrey D. Strain, Ph.D.",
    "email": "jeff.strain@nau.edu",
    "phone": "928-523-4048",
    "office": "Eastburn #143",
    "office_hours": "3:00-4:30 PM Wednesdays, 3:00-5:30 PM Thursdays"
  },
  "credits": 3,
  "meeting": {
    "day": "Thursday",
    "start": "17:30",
    "end": "20:00",
    "location": "Eastburn #151"
  },
  "semester": {"term": "Spring", "year": 2026, "start": "2026-01-15", "end": "2026-05-07"},
  "format": "In-Person",
  "description": "Doctoral-level practicum emphasizing advanced skills, educational and psychological assessment, and intervention strategies. 150 clock hours minimum.",
  "prerequisites": ["EPS 670", "EPS 692", "EPS 737"],
  "grading_options": ["Pass-fail", "Letter grade"],
  "repeatable": {"max_units": 12},
  "syllabus_status": "adapted_from_f25_draft"
}
EOF

cat > data/courses/EPS_740/assignments.json << 'EOF'
{
  "course_id": "EPS_740",
  "total_points": null,
  "syllabus_status": "adapted_from_f25_draft",
  "clinical_hours_requirement": {"minimum_clock_hours": 150},
  "assignments": [
    {"id": "740_case_presentation_1", "title": "Case Presentation #1", "type": "presentation", "due_date": "2026-01-29", "points": null, "project_group": "case_presentations"},
    {"id": "740_case_presentation_2", "title": "Case Presentation #2", "type": "presentation", "due_date": null, "points": null, "project_group": "case_presentations"},
    {"id": "740_practicum_hours", "title": "Practicum Hours Documentation", "type": "practicum", "due_date": "2026-05-07", "points": null, "recurring": true},
    {"id": "740_supervision_log", "title": "Supervision Hours Log", "type": "practicum", "due_date": "2026-05-07", "points": null, "recurring": true}
  ]
}
EOF

cat > data/courses/EPS_740/schedule.json << 'EOF'
{
  "course_id": "EPS_740",
  "syllabus_status": "adapted_from_f25_draft",
  "schedule": [
    {"week": 1, "date": "2026-01-15", "topics": ["Introduction, Orientation"], "due": []},
    {"week": 2, "date": "2026-01-22", "topics": ["Supervision Models"], "due": []},
    {"week": 3, "date": "2026-01-29", "topics": ["Case Presentations"], "due": ["740_case_presentation_1"]},
    {"week": 4, "date": "2026-02-05", "topics": ["Case Presentations"], "due": []},
    {"week": 5, "date": "2026-02-12", "topics": ["Case Presentations"], "due": []},
    {"week": 6, "date": "2026-02-19", "topics": ["Case Presentations"], "due": []},
    {"week": 7, "date": "2026-02-26", "topics": ["Individual Meetings"], "due": []},
    {"week": 8, "date": "2026-03-05", "topics": ["Case Presentations"], "due": []},
    {"week": 9, "date": "2026-03-12", "topics": [], "due": [], "notes": "Spring Break"},
    {"week": 10, "date": "2026-03-19", "topics": ["Case Presentations"], "due": []},
    {"week": 11, "date": "2026-03-26", "topics": ["Case Presentations"], "due": []},
    {"week": 12, "date": "2026-04-02", "topics": ["Case Presentations"], "due": []},
    {"week": 13, "date": "2026-04-09", "topics": ["Case Presentations"], "due": []},
    {"week": 14, "date": "2026-04-16", "topics": ["Case Presentations"], "due": []},
    {"week": 15, "date": "2026-04-23", "topics": ["Case Presentations"], "due": []},
    {"week": 16, "date": "2026-04-30", "topics": ["Individual Meetings", "Wrap-up"], "due": ["740_practicum_hours", "740_supervision_log"]}
  ]
}
EOF

cat > data/courses/EPS_740/courserequirements.json << 'EOF'
{
  "course_id": "EPS_740",
  "syllabus_status": "adapted_from_f25_draft",
  "required_materials": [
    {"type": "reference", "title": "Ethical Principles of Psychologists and Code of Conduct", "authors": ["APA"], "year": 2017}
  ],
  "grading": {"options": ["Pass-fail", "Letter grade"]},
  "clinical_requirements": {"minimum_hours": 150, "components": ["Direct client contact", "Supervision received", "Supervision provided"]},
  "case_presentation_requirements": {"printed_copies": 3}
}
EOF

echo ""
echo "✓ All course data files created!"
echo ""
echo "Next steps:"
echo "  git add data/courses/"
echo "  git commit -m 'Add course data structure for Spring 2026'"
echo "  git push"
