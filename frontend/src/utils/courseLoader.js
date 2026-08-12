export function loadWorkspaceCourses() {
  const modules = import.meta.glob('../../../agents/workspace/*/course_profile.json', { eager: true });
  
  const courses = Object.values(modules)
    .map((mod) => {
      const profile = mod.default || mod;
      return {
        course_code: profile.course_code,
        course_name: profile.course_name,
        term: profile.term || null,
        contacts: profile.contacts || null,
        evaluations: profile.evaluations || null,
        structure: profile.structure || null
      };
    })
    .filter((course) => Boolean(course.course_code && course.course_name));

  // Sort alphabetically by course_code
  courses.sort((a, b) => a.course_code.localeCompare(b.course_code));

  return courses;
}
