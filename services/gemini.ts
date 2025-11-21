
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SeoResult, AuditType, ChatMessage } from '../types';

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const analyzeSeo = async (
  url: string, 
  htmlContext: string, 
  auditType: AuditType,
  targetAudience: string,
  geo: string
): Promise<SeoResult> => {
  if (!apiKey) throw new Error("API Key not found");

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      auditType: { type: Type.STRING, enum: ["WEB", "APP"] },
      overallScore: { type: Type.NUMBER },
      categoryScores: {
        type: Type.OBJECT,
        properties: {
          technical: { type: Type.NUMBER },
          content: { type: Type.NUMBER },
          ux: { type: Type.NUMBER },
          authority: { type: Type.NUMBER },
        },
        required: ["technical", "content", "ux", "authority"]
      },
      summary: { type: Type.STRING },
      specs: {
        type: Type.OBJECT,
        nullable: true,
        properties: {
          titleTag: { type: Type.STRING },
          titleLength: { type: Type.NUMBER },
          metaDescription: { type: Type.STRING },
          metaDescriptionLength: { type: Type.NUMBER },
          canonicalTag: { type: Type.STRING, nullable: true },
          robotsMeta: { type: Type.STRING, nullable: true },
          viewportMeta: { type: Type.STRING, nullable: true },
          charset: { type: Type.STRING, nullable: true },
          h1Count: { type: Type.NUMBER },
          h1Content: { type: Type.STRING },
          headingStructure: { type: Type.STRING },
          wordCount: { type: Type.NUMBER },
          textToHtmlRatio: { type: Type.NUMBER },
          imageCount: { type: Type.NUMBER },
          imagesWithoutAlt: { type: Type.NUMBER },
          internalLinkCount: { type: Type.NUMBER },
          externalLinkCount: { type: Type.NUMBER },
          linkStats: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                  internal: {
                      type: Type.OBJECT,
                      properties: {
                          dofollow: { type: Type.NUMBER },
                          nofollow: { type: Type.NUMBER },
                          broken: { type: Type.NUMBER }
                      }
                  },
                  external: {
                      type: Type.OBJECT,
                      properties: {
                          dofollow: { type: Type.NUMBER },
                          nofollow: { type: Type.NUMBER },
                          broken: { type: Type.NUMBER }
                      }
                  }
              }
          },
          schemaTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
          openGraphTags: { type: Type.BOOLEAN },
          twitterCard: { type: Type.BOOLEAN },
          favicon: { type: Type.BOOLEAN },
        },
      },
      asoSpecs: {
        type: Type.OBJECT,
        nullable: true,
        properties: {
          appName: { type: Type.STRING },
          appNameLength: { type: Type.NUMBER },
          subtitle: { type: Type.STRING, nullable: true },
          shortDescription: { type: Type.STRING, nullable: true },
          promotionalText: { type: Type.STRING, nullable: true },
          descriptionLength: { type: Type.NUMBER },
          keywordsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
          rating: { type: Type.NUMBER },
          reviewCount: { type: Type.NUMBER },
          lastUpdated: { type: Type.STRING, nullable: true },
          version: { type: Type.STRING, nullable: true },
          hasVideoPreview: { type: Type.BOOLEAN },
        }
      },
      issues: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["CRITICAL", "WARNING", "INFO", "GOOD"] },
            category: { type: Type.STRING, enum: ["TECHNICAL", "CONTENT", "UX_MOBILE", "AUTHORITY"] },
            recommendation: { type: Type.STRING },
            codeFix: { 
                type: Type.OBJECT, 
                nullable: true,
                properties: {
                    current: { type: Type.STRING },
                    optimized: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                }
            },
            impact: { type: Type.STRING },
            effort: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] }
          },
          required: ["title", "severity", "category"],
        },
      },
      roadmap: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                stage: { type: Type.STRING, enum: ["IMMEDIATE", "SHORT_TERM", "LONG_TERM"] },
                tasks: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            task: { type: Type.STRING },
                            impact: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
                            effort: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] }
                        }
                    }
                }
            }
        }
      },
      contentAnalysis: {
        type: Type.OBJECT,
        nullable: true,
        properties: {
            tone: { type: Type.STRING },
            readabilityLevel: { type: Type.STRING },
            sentiment: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"] },
            topEntities: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      keywordAnalysis: {
        type: Type.OBJECT,
        nullable: true,
        description: "Analysis of keyword frequency and density",
        properties: {
            topKeywords: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        keyword: { type: Type.STRING },
                        count: { type: Type.NUMBER },
                        density: { type: Type.NUMBER, description: "Percentage frequency (0-100)" }
                    }
                }
            },
            recommendation: { type: Type.STRING }
        }
      },
      socialPreview: {
        type: Type.OBJECT,
        nullable: true,
        properties: {
            title: { type: Type.STRING, nullable: true },
            description: { type: Type.STRING, nullable: true },
            image: { type: Type.STRING, nullable: true },
            siteName: { type: Type.STRING, nullable: true }
        }
      },
      techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
      keywordStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
      contentGapAnalysis: { type: Type.STRING },
      trafficForecast: {
        type: Type.ARRAY,
        description: "Predicted traffic growth over next 6 months if fixes are applied",
        items: {
            type: Type.OBJECT,
            properties: {
                month: { type: Type.STRING },
                current: { type: Type.NUMBER },
                projected: { type: Type.NUMBER }
            }
        }
      },
      competitors: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            url: { type: Type.STRING },
            overlapScore: { type: Type.NUMBER },
            marketPosition: { type: Type.STRING, enum: ["LEADER", "CHALLENGER", "NICHE"] },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            scores: {
                type: Type.OBJECT,
                properties: {
                  technical: { type: Type.NUMBER },
                  content: { type: Type.NUMBER },
                  ux: { type: Type.NUMBER },
                  authority: { type: Type.NUMBER },
                }
            },
            metrics: {
                type: Type.OBJECT,
                description: "Estimated SEO metrics based on domain authority and market presence",
                properties: {
                    monthlyTraffic: { type: Type.NUMBER },
                    organicKeywords: { type: Type.NUMBER },
                    domainAuthority: { type: Type.NUMBER },
                    backlinks: { type: Type.NUMBER },
                    topKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
          }
        }
      }
    },
    required: ["overallScore", "categoryScores", "summary", "issues", "competitors", "trafficForecast"],
  };

  const prompt = `
    Act as a Chief SEO Data Scientist for a SaaS platform like Semrush or Ahrefs.
    Audit the content for ${auditType} (Target Audience: ${targetAudience}, Region: ${geo}).
    URL: ${url}

    CRITICAL INSTRUCTIONS:
    1. **Competitor Intelligence**: Identify 3 realistic competitors. You MUST estimate their quantitative metrics (Monthly Traffic, DA, Backlinks, Keywords) based on their known market position and brand power. Do not return 0. Use realistic estimates for a "Pro" tool feel.
    2. **Traffic Forecast**: Generate a 6-month projection. "Current" should remain flat, "Projected" should show realistic growth (e.g., 20-50%) if your SEO recommendations are implemented.
    3. **Tech Stack**: Identify CMS (WordPress, Shopify), Analytics (GA4), and Frameworks (React, Next.js).
    4. **Code Fixes**: Provide specific HTML/CSS/JS code blocks for technical issues.
    5. **Keyword Analysis**: Analyze the text content to identify top 5-8 keywords/phrases (excluding stop words). Calculate their frequency and density percentage relative to the estimated total word count.
    6. **Link Analysis**: Estimate the internal and external link breakdown. Distinguish between dofollow/nofollow and identify potential broken links based on href structure (e.g. empty, #, or malformed).
    
    Context: ${htmlContext.slice(0, 50000)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2, 
      thinkingConfig: { thinkingBudget: 4096 } 
    },
  });

  if (!response.text) throw new Error("No response");
  
  return {
    ...JSON.parse(response.text),
    url,
    targetAudience,
    geo,
    timestamp: Date.now(),
    id: crypto.randomUUID()
  };
};

export const chatWithAuditor = async (
    history: ChatMessage[], 
    newMessage: string, 
    context: SeoResult
): Promise<string> => {
    if (!apiKey) throw new Error("API Key not found");
    
    // Simplify the context to specific data points to save tokens and improve focus
    const simplifiedIssues = context.issues.map(i => ({
        title: i.title,
        severity: i.severity,
        category: i.category,
        recommendation: i.recommendation
    }));

    const systemPrompt = `
      You are the AI Auditor for this SEO report. 
      
      REPORT DATA:
      - Target URL: ${context.url}
      - Overall Health Score: ${context.overallScore}/100
      - Executive Summary: ${context.summary}
      - Total Issues Found: ${context.issues.length}
      - Detected Tech Stack: ${context.techStack?.join(', ')}
      
      DETAILED ISSUES:
      ${JSON.stringify(simplifiedIssues)}
      
      INSTRUCTIONS:
      - Answer the user's questions specifically about *this* audit data.
      - If they ask for a fix, provide code examples or specific instructions.
      - Be professional, technical, and concise.
      - Do not make up issues that are not in the data.
    `;

    // Map internal ChatMessage to Gemini API History Content
    const chatHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));

    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: { systemInstruction: systemPrompt },
        history: chatHistory
    });
    
    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
};
