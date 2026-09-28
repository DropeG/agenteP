export function loadWorkspaceCourses() {
  const profileModules = import.meta.glob('../../../agents/workspace/*/course_profile.json', { eager: true });
  const gradingModules = import.meta.glob('../../../agents/workspace/*/grading_scheme.json', { eager: true });

  const gradingSchemes = {};
  for (const [path, mod] of Object.entries(gradingModules)) {
    const match = path.match(/agents\/workspace\/([^/]+)\/grading_scheme\.json/i);
    if (match && match[1]) {
      gradingSchemes[match[1].toUpperCase()] = mod.default || mod;
    }
  }

  const courses = Object.values(profileModules)
    .map((mod) => {
      const profile = mod.default || mod;
      const code = (profile.course_code || '').toUpperCase();
      return {
        course_code: profile.course_code,
        course_name: profile.course_name,
        term: profile.term || null,
        contacts: profile.contacts || null,
        evaluations: profile.evaluations || null,
        structure: profile.structure || null,
        grading_scheme: gradingSchemes[code] || null
      };
    })
    .filter((course) => Boolean(course.course_code && course.course_name));

  // Sort alphabetically by course_code
  courses.sort((a, b) => a.course_code.localeCompare(b.course_code));

  return courses;
}

