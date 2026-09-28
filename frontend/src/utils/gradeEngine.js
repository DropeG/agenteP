/**
 * Grade Engine for Agente P
 * Universal, dynamic academic grading calculator and solver for Chilean university scale (1.0 - 7.0).
 */

export const GRADE_SCALE = {
  MIN: 1.0,
  MAX: 7.0,
  PASSING_DEFAULT: 3.95
};

/**
 * Normalizes grades state map { [itemId]: number | null }
 */
export function getInitialGradesState(scheme) {
  if (!scheme || !scheme.categories) return {};
  const state = {};

  const processItems = (items) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      state[item.id] = 1.0; // All grades start at 1.0 by default
    }
  };

  for (const cat of scheme.categories) {
    if (cat.items) {
      processItems(cat.items);
    }
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        processItems(sub.items);
      }
    }
  }

  return state;
}

/**
 * Calculates a single category's grade and metrics given the current grades state.
 */
export function calculateCategoryScore(category, gradesState, options = {}) {
  const { fallbackGrade = null } = options;

  // Case 1: Subcategories average
  if (category.aggregation === 'subcategories_average' && Array.isArray(category.subcategories)) {
    const subResults = category.subcategories.map(sub => {
      let items = (sub.items || []).map(it => {
        let g = gradesState[it.id];
        if (g === null || g === undefined) {
          g = fallbackGrade;
        }
        return {
          id: it.id,
          name: it.name,
          short_name: it.short_name,
          grade: g,
          isEvaluated: gradesState[it.id] !== null && gradesState[it.id] !== undefined
        };
      });

      const evaluatedItems = items.filter(it => it.grade !== null);
      if (evaluatedItems.length === 0) {
        return {
          id: sub.id,
          name: sub.name,
          short_name: sub.short_name,
          score: null,
          items,
          evaluatedCount: 0,
          totalCount: items.length
        };
      }

      // Handle drop lowest
      let effectiveItems = [...items];
      if (sub.drop_lowest && sub.drop_lowest > 0 && evaluatedItems.length > sub.drop_lowest) {
        // Sort evaluated ascending by grade
        const sortedEval = [...evaluatedItems].sort((a, b) => a.grade - b.grade);
        const droppedIds = new Set(sortedEval.slice(0, sub.drop_lowest).map(x => x.id));
        effectiveItems = items.map(it => ({
          ...it,
          isDropped: droppedIds.has(it.id)
        }));
      }

      const activeGraded = effectiveItems.filter(it => it.grade !== null && !it.isDropped);
      const subScore = activeGraded.length > 0 
        ? activeGraded.reduce((acc, it) => acc + it.grade, 0) / activeGraded.length
        : null;

      return {
        id: sub.id,
        name: sub.name,
        short_name: sub.short_name,
        score: subScore !== null ? Number(subScore.toFixed(2)) : null,
        items: effectiveItems,
        evaluatedCount: evaluatedItems.length,
        totalCount: items.length
      };
    });

    const evaluatedSubs = subResults.filter(s => s.score !== null);
    const catScore = evaluatedSubs.length > 0
      ? evaluatedSubs.reduce((acc, s) => acc + s.score, 0) / evaluatedSubs.length
      : null;

    return {
      id: category.id,
      name: category.name,
      short_name: category.short_name,
      weight: category.weight,
      score: catScore !== null ? Number(catScore.toFixed(2)) : null,
      subcategories: subResults
    };
  }

  // Case 2: Direct items (e.g. exam_replaces_worst_or_double or weighted_sum or simple)
  const items = (category.items || []).map(it => {
    let g = gradesState[it.id];
    if (g === null || g === undefined) {
      g = fallbackGrade;
    }
    return {
      id: it.id,
      name: it.name,
      short_name: it.short_name,
      weight: it.weight,
      is_exam: Boolean(it.is_exam),
      grade: g,
      isEvaluated: gradesState[it.id] !== null && gradesState[it.id] !== undefined
    };
  });

  const evaluatedItems = items.filter(it => it.grade !== null);
  if (evaluatedItems.length === 0) {
    return {
      id: category.id,
      name: category.name,
      short_name: category.short_name,
      weight: category.weight,
      score: null,
      items,
      evaluatedCount: 0,
      totalCount: items.length
    };
  }

  // Specific aggregation: exam_replaces_worst_or_double (UC standard NIE formula)
  if (category.aggregation === 'exam_replaces_worst_or_double') {
    const i1 = items.find(it => it.id === 'i1');
    const i2 = items.find(it => it.id === 'i2');
    const ex = items.find(it => it.id === 'ex' || it.is_exam);

    let catScore = null;
    let effectiveItems = [...items];

    // Check exemption if i1 and i2 are evaluated and ex is empty or below threshold
    if (category.exemption && i1 && i2 && i1.grade !== null && i2.grade !== null) {
      const avgInterrogaciones = (i1.grade + i2.grade) / 2;
      const canExempt = avgInterrogaciones >= category.exemption.threshold && i1.grade >= 4.0 && i2.grade >= 4.0;
      
      if (canExempt && (ex && ex.grade === null)) {
        catScore = avgInterrogaciones;
        if (ex) {
          effectiveItems = effectiveItems.map(it => it.id === ex.id ? { ...it, isExempted: true } : it);
        }
      }
    }

    if (catScore === null) {
      // NIE formula: (I1 + I2 + 2*EX - min(I1, I2, EX)) / 3
      if (i1 && i2 && ex && i1.grade !== null && i2.grade !== null && ex.grade !== null) {
        const minVal = Math.min(i1.grade, i2.grade, ex.grade);
        catScore = (i1.grade + i2.grade + 2 * ex.grade - minVal) / 3;

        // Flag the dropped element
        let droppedId = null;
        if (minVal === i1.grade) droppedId = i1.id;
        else if (minVal === i2.grade) droppedId = i2.id;
        else droppedId = ex.id;

        effectiveItems = effectiveItems.map(it => ({
          ...it,
          isDropped: it.id === droppedId
        }));
      } else {
        // Average evaluated so far
        const sum = evaluatedItems.reduce((acc, it) => acc + it.grade, 0);
        catScore = sum / evaluatedItems.length;
      }
    }

    return {
      id: category.id,
      name: category.name,
      short_name: category.short_name,
      weight: category.weight,
      score: catScore !== null ? Number(catScore.toFixed(2)) : null,
      items: effectiveItems,
      evaluatedCount: evaluatedItems.length,
      totalCount: items.length
    };
  }

  // Specific aggregation: weighted_sum
  if (category.aggregation === 'weighted_sum' || items.some(it => it.weight != null)) {
    const totalWeightEvaluated = evaluatedItems.reduce((acc, it) => acc + (it.weight || 0), 0);
    let catScore = null;
    if (totalWeightEvaluated > 0) {
      const weightedSum = evaluatedItems.reduce((acc, it) => acc + it.grade * (it.weight || 0), 0);
      catScore = weightedSum / totalWeightEvaluated;
    } else {
      catScore = evaluatedItems.reduce((acc, it) => acc + it.grade, 0) / evaluatedItems.length;
    }

    return {
      id: category.id,
      name: category.name,
      short_name: category.short_name,
      weight: category.weight,
      score: catScore !== null ? Number(catScore.toFixed(2)) : null,
      items,
      evaluatedCount: evaluatedItems.length,
      totalCount: items.length
    };
  }

  // Default: simple average
  const catScore = evaluatedItems.reduce((acc, it) => acc + it.grade, 0) / evaluatedItems.length;
  return {
    id: category.id,
    name: category.name,
    short_name: category.short_name,
    weight: category.weight,
    score: catScore !== null ? Number(catScore.toFixed(2)) : null,
    items,
    evaluatedCount: evaluatedItems.length,
    totalCount: items.length
  };
}

/**
 * Calculates overall course grade and requirements status.
 */
export function calculateOverallCourseGrade(scheme, gradesState, options = {}) {
  if (!scheme || !Array.isArray(scheme.categories)) {
    return { finalGrade: null, rawScore: null, passed: false, categories: [], requirementsStatus: [] };
  }

  const categoryResults = scheme.categories.map(cat => calculateCategoryScore(cat, gradesState, options));

  // Overall weighted score
  const totalWeight = categoryResults.reduce((acc, c) => acc + (c.weight || 0), 0);
  const evaluatedCategories = categoryResults.filter(c => c.score !== null);
  
  let rawScore = null;
  if (evaluatedCategories.length > 0) {
    if (totalWeight > 0) {
      const evaluatedWeight = evaluatedCategories.reduce((acc, c) => acc + (c.weight || 0), 0);
      const weightedSum = evaluatedCategories.reduce((acc, c) => acc + c.score * (c.weight || 0), 0);
      rawScore = evaluatedWeight > 0 ? weightedSum / evaluatedWeight : null;
    } else {
      rawScore = evaluatedCategories.reduce((acc, c) => acc + c.score, 0) / evaluatedCategories.length;
    }
  }

  // Evaluate requirements
  const requirementsStatus = (scheme.requirements || []).map(req => {
    if (req.type === 'category_min' || req.category_id) {
      const cat = categoryResults.find(c => c.id === req.category_id);
      const meets = cat && cat.score !== null ? cat.score >= req.min : null;
      return {
        id: req.id,
        label: req.label || `${cat ? cat.name : req.category_id} ≥ ${req.min}`,
        requiredMin: req.min,
        currentScore: cat ? cat.score : null,
        meets
      };
    }
    return {
      id: req.id,
      label: req.label,
      meets: null
    };
  });

  const passingGrade = scheme.passing_grade || GRADE_SCALE.PASSING_DEFAULT;
  let finalGrade = rawScore !== null ? Number(rawScore.toFixed(2)) : null;
  let requirementsFailed = false;

  if (finalGrade !== null) {
    // If any requirement with evaluated score fails, clamp to 3.9 (standard UC rule)
    for (const req of requirementsStatus) {
      if (req.meets === false) {
        requirementsFailed = true;
        finalGrade = Math.min(3.9, finalGrade);
      }
    }
  }

  const passed = finalGrade !== null ? finalGrade >= passingGrade && !requirementsFailed : false;

  return {
    finalGrade: finalGrade !== null ? Number(finalGrade.toFixed(1)) : null,
    finalGradeExact: finalGrade,
    rawScore: rawScore !== null ? Number(rawScore.toFixed(2)) : null,
    passed,
    passingGrade,
    requirementsFailed,
    categories: categoryResults,
    requirementsStatus
  };
}

/**
 * Solves for the required grade on targetItemId to achieve targetFinalGrade.
 * Returns:
 * {
 *   status: 'ALREADY_PASSED' | 'NEEDED' | 'IMPOSSIBLE',
 *   neededGrade: number | null,
 *   targetItem: object,
 *   details: string
 * }
 */
export function solveRequiredGrade(scheme, currentGradesState, targetItemId, targetFinalGrade = GRADE_SCALE.PASSING_DEFAULT, assumptionFallback = 4.0) {
  if (!scheme || !targetItemId) {
    return { status: 'INVALID', neededGrade: null, details: 'Faltan datos de esquema o ítem objetivo.' };
  }

  // Helper to test a candidate grade on targetItemId
  const testCandidate = (candidateGrade) => {
    const testState = { ...currentGradesState, [targetItemId]: candidateGrade };
    return calculateOverallCourseGrade(scheme, testState, { fallbackGrade: assumptionFallback });
  };

  // Test minimum bound (1.0)
  const minResult = testCandidate(GRADE_SCALE.MIN);
  if (minResult.finalGradeExact !== null && minResult.finalGradeExact >= targetFinalGrade && !minResult.requirementsFailed) {
    return {
      status: 'ALREADY_PASSED',
      neededGrade: 1.0,
      details: '¡Ya apruebas la asignatura incluso con nota mínima (1.0) en esta evaluación!'
    };
  }

  // Test maximum bound (7.0)
  const maxResult = testCandidate(GRADE_SCALE.MAX);
  if (maxResult.finalGradeExact === null || maxResult.finalGradeExact < targetFinalGrade || maxResult.requirementsFailed) {
    return {
      status: 'IMPOSSIBLE',
      neededGrade: null,
      details: 'Incluso con nota 7.0 no se alcanza la nota objetivo bajo los supuestos actuales.'
    };
  }

  // Binary search (bisection) over [1.0, 7.0]
  let low = GRADE_SCALE.MIN;
  let high = GRADE_SCALE.MAX;
  const tolerance = 0.005;

  while (high - low > tolerance) {
    const mid = (low + high) / 2;
    const res = testCandidate(mid);
    if (res.finalGradeExact >= targetFinalGrade && !res.requirementsFailed) {
      high = mid; // can achieve with mid, try lower
    } else {
      low = mid; // cannot achieve with mid, need higher
    }
  }

  // Round up to 1 decimal place (e.g. 4.21 -> 4.3 or 4.25)
  const neededRounded = Number((Math.ceil(high * 10) / 10).toFixed(1));

  return {
    status: 'NEEDED',
    neededGrade: Math.min(GRADE_SCALE.MAX, neededRounded),
    exactGrade: Number(high.toFixed(2)),
    details: `Necesitas al menos un ${neededRounded.toFixed(1)} para alcanzar la meta.`
  };
}

/**
 * Extracts a flat list of all grade items with metadata for easy selection.
 */
export function getAllGradeItems(scheme) {
  if (!scheme || !Array.isArray(scheme.categories)) return [];
  const items = [];

  for (const cat of scheme.categories) {
    if (cat.items) {
      for (const it of cat.items) {
        items.push({
          ...it,
          categoryId: cat.id,
          categoryName: cat.name,
          categoryShort: cat.short_name
        });
      }
    }
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        for (const it of (sub.items || [])) {
          items.push({
            ...it,
            categoryId: cat.id,
            categoryName: `${cat.name} (${sub.name})`,
            categoryShort: sub.short_name || cat.short_name,
            subcategoryId: sub.id
          });
        }
      }
    }
  }

  return items;
}

/**
 * Helper to build a fallback scheme from course_profile evaluations if no grading_scheme.json exists
 */
export function buildFallbackScheme(course) {
  if (!course) return null;
  const rawEvaluations = course.evaluations || [];
  
  let categories = [];
  if (Array.isArray(rawEvaluations) && rawEvaluations.length > 0) {
    categories = rawEvaluations.map((ev, idx) => {
      const key = (ev.key || '').toLowerCase();
      const details = (ev.details || '').toLowerCase();
      const name = (ev.name || '').toLowerCase();

      let items = [];

      if (key.includes('escrita') || key.includes('interrogacion') || details.includes('interrogacion') || name.includes('interrogacion')) {
        items = [
          { id: `${ev.key}_i1`, name: 'Interrogación 1', short_name: 'I1', default_grade: 1.0 },
          { id: `${ev.key}_i2`, name: 'Interrogación 2', short_name: 'I2', default_grade: 1.0 },
          { id: `${ev.key}_ex`, name: 'Examen', short_name: 'Examen', default_grade: 1.0, is_exam: true }
        ];
      } else if (key.includes('tarea') || name.includes('tarea') || details.includes('tarea')) {
        const count = details.includes('4') ? 4 : details.includes('3') ? 3 : 2;
        items = Array.from({ length: count }, (_, i) => ({
          id: `${ev.key}_t${i + 1}`,
          name: `Tarea ${i + 1}`,
          short_name: `T${i + 1}`,
          default_grade: 1.0
        }));
      } else if (key.includes('control') || name.includes('control')) {
        items = Array.from({ length: 5 }, (_, i) => ({
          id: `${ev.key}_c${i + 1}`,
          name: `Control ${i + 1}`,
          short_name: `C${i + 1}`,
          default_grade: 1.0
        }));
      } else if (key.includes('proyecto') || name.includes('proyecto')) {
        items = [
          { id: `${ev.key}_e1`, name: 'Entrega 1', short_name: 'E1', default_grade: 1.0 },
          { id: `${ev.key}_e2`, name: 'Entrega 2', short_name: 'E2', default_grade: 1.0 },
          { id: `${ev.key}_e3`, name: 'Entrega 3', short_name: 'E3', default_grade: 1.0 }
        ];
      } else if (key.includes('actividad') || name.includes('actividad')) {
        items = [
          { id: `${ev.key}_a1`, name: 'Actividad 1', short_name: 'A1', default_grade: 1.0 },
          { id: `${ev.key}_a2`, name: 'Actividad 2', short_name: 'A2', default_grade: 1.0 },
          { id: `${ev.key}_a3`, name: 'Actividad 3', short_name: 'A3', default_grade: 1.0 }
        ];
      } else {
        items = [
          {
            id: `${ev.key || 'ev'}_1`,
            name: ev.name || `Evaluación 1`,
            short_name: ev.key || `E1`,
            default_grade: 1.0
          }
        ];
      }

      return {
        id: ev.key || `cat_${idx}`,
        name: ev.name || ev.key || `Evaluación ${idx + 1}`,
        short_name: ev.key || `Ev ${idx + 1}`,
        weight: ev.weight != null ? ev.weight : (100 / rawEvaluations.length),
        aggregation: 'simple_average',
        formula_description: ev.details || null,
        items
      };
    });
  } else {
    categories = [
      {
        id: 'general_eval',
        name: 'Evaluaciones del Curso',
        short_name: 'Evaluaciones',
        weight: 100,
        aggregation: 'simple_average',
        items: [
          { id: 'i1', name: 'Interrogación 1', short_name: 'I1', default_grade: 1.0 },
          { id: 'i2', name: 'Interrogación 2', short_name: 'I2', default_grade: 1.0 },
          { id: 'ex', name: 'Examen', short_name: 'Examen', default_grade: 1.0 }
        ]
      }
    ];
  }

  return {
    course_code: course.course_code,
    passing_grade: GRADE_SCALE.PASSING_DEFAULT,
    scale: { min: 1.0, max: 7.0 },
    categories,
    requirements: []
  };
}
