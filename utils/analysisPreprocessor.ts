// utils/analysisPreprocessor.ts

export interface ProcessedAnalysis {
  id: string;
  title: string;
  type: 'key_trends' | 'netnographic' | 'final';
  date: string;
  data: any;
}

export interface KeyTrendsSection {
  subheading?: string;
  content?: string;
}

export interface KeyTrendsData {
  overview?: KeyTrendsSection[];
  emerging_trends?: KeyTrendsSection[];
  market_conditions?: KeyTrendsSection[];
  competitive_benchmarks?: KeyTrendsSection[];
  user_workarounds?: KeyTrendsSection[];
  go_to_market?: KeyTrendsSection[];
  validation_signals?: KeyTrendsSection[];
  recommendations?: KeyTrendsSection[];
}

export interface StandardSection {
  heading: string;
  content: string;
  bullets?: string[];
  subsections?: StandardSection[];
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

    // Process data based on type
    let processedData = value;
    if (type === 'key_trends') {
      processedData = processKeyTrendsData(value);
    } else {
      processedData = normalizeAnalysisData(value);
    }

    // Create the processed report
    reports.push({
      id: key.toLowerCase().replace(/\s+/g, '_'),
      title,
      type,
      date: value.date || new Date().toISOString(),
      data: processedData
    });
  });

  return reports;
}

/**
 * Process key trends data to convert to standard sections format
 */
function processKeyTrendsData(data: any): { sections: StandardSection[] } {
  const sections: StandardSection[] = [];

  // Define the order and display names for key trends sections
  const sectionConfig = [
    { key: 'overview', title: '1- Overview' },
    { key: 'emerging_trends', title: '2- Emerging Trends' },
    { key: 'market_conditions', title: '3- Market Conditions' },
    { key: 'competitive_benchmarks', title: '4- Competitive Benchmarks & Industry Comparison' },
    { key: 'user_workarounds', title: '5- Current User Workarounds & Substitutes' },
    { key: 'go_to_market', title: '6- Go-to-Market Landscape & Channel Fit' },
    { key: 'validation_signals', title: '7- Key Validation Signals' },
    { key: 'recommendations', title: '8- Recommendations' }
  ];

  sectionConfig.forEach(({ key, title }) => {
    const sectionData = data[key];
    if (!sectionData || !Array.isArray(sectionData)) return;

    const subsections: StandardSection[] = [];
    let mainContent = '';

    sectionData.forEach((item: KeyTrendsSection) => {
      if (item.subheading && item.content) {
        // Both subheading and content - create a subsection
        subsections.push({
          heading: item.subheading,
          content: item.content,
          bullets: [],
          subsections: []
        });
      } else if (item.subheading && !item.content) {
        // Only subheading - treat as a divider or intro for next content
        if (subsections.length > 0 || mainContent) {
          // If we already have content, create a new subsection
          subsections.push({
            heading: item.subheading,
            content: '',
            bullets: [],
            subsections: []
          });
        }
      } else if (item.content && !item.subheading) {
        // Only content
        if (subsections.length > 0 && subsections[subsections.length - 1].content === '') {
          // Add to the last subsection if it has no content
          subsections[subsections.length - 1].content = item.content;
        } else {
          // Otherwise, add to main content
          mainContent += (mainContent ? '\n\n' : '') + item.content;
        }
      }
    });

    sections.push({
      heading: title,
      content: mainContent,
      bullets: [],
      subsections
    });
  });

  return { sections };
}

/**
 * Normalizes analysis data for ethnographic/final analysis types
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
function normalizeSectionData(section: any): StandardSection {
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
