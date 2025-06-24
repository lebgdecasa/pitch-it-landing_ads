// utils/analysisPreprocessor.ts

export interface ProcessedAnalysis {
  id: string;
  title: string;
  type: 'key_trends' | 'netnographic' | 'final';
  date: string;
  data: any;
}

/**
 * Preprocesses analysis data from the database to ensure consistent structure
 */
export function preprocessAnalysisData(rawAnalysis: any): ProcessedAnalysis[] {
  const reports: ProcessedAnalysis[] = [];

  if (!rawAnalysis || typeof rawAnalysis !== 'object') {
    return reports;
  }

  // Handle different analysis formats
  Object.entries(rawAnalysis).forEach(([key, value]: [string, any]) => {
    if (!value || typeof value !== 'object') return;

    // Determine the type based on key
    let type: ProcessedAnalysis['type'] | null = null;
    const lowerKey = key.toLowerCase().replace(/_/g, '').replace(/\s/g, '');

    if (lowerKey.includes('keytrend')) {
      type = 'key_trends';
    } else if (lowerKey.includes('netnographic')) {
      type = 'netnographic';
    } else if (lowerKey.includes('final')) {
      type = 'final';
    }

    // Skip if type couldn't be determined
    if (!type) return;

    // Extract title
    let title = value.title || key;

    // Format the title if it's just a key
    if (title === key) {
      title = key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    // Create the processed report
    reports.push({
      id: key.toLowerCase().replace(/\s+/g, '_'),
      title,
      type,
      date: value.date || new Date().toISOString(),
      data: normalizeAnalysisData(value)
    });
  });

  return reports;
}

/**
 * Normalizes analysis data to ensure consistent structure
 */
function normalizeAnalysisData(data: any): any {
  if (!data || typeof data !== 'object') return data;

  // If data already has sections, ensure they're properly formatted
  if (data.sections && Array.isArray(data.sections)) {
    return {
      ...data,
      sections: data.sections.map(normalizeSectionData)
    };
  }

  // If data has numbered structure (1., 2., etc.), convert to sections
  const numberedKeys = Object.keys(data).filter(key => /^\d+\./.test(key));
  if (numberedKeys.length > 0) {
    const sections = numberedKeys.map(key => {
      const sectionData = data[key];
      const heading = key.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();

      return {
        heading,
        content: typeof sectionData === 'string' ? sectionData : '',
        bullets: Array.isArray(sectionData) ? sectionData : [],
        subsections: []
      };
    });

    return {
      ...data,
      sections
    };
  }

  // Return data as-is if no special structure detected
  return data;
}

/**
 * Normalizes a section to ensure consistent structure
 */
function normalizeSectionData(section: any): any {
  if (!section || typeof section !== 'object') {
    return {
      heading: 'Section',
      content: String(section),
      bullets: [],
      subsections: []
    };
  }

  return {
    heading: section.heading || section.title || 'Section',
    content: section.content || '',
    bullets: Array.isArray(section.bullets) ? section.bullets : [],
    subsections: Array.isArray(section.subsections)
      ? section.subsections.map(normalizeSectionData)
      : []
  };
}
