import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';

interface FeaturesSectionProps {
  onOpenDemoModal: () => void;
}

const FeaturesSection = ({ onOpenDemoModal }: FeaturesSectionProps) => {
  const t = useTranslation();
  const [ref, isVisible] = useFadeInOnScroll();
  
  return (
    <section id="features" ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features_title')}</h2>
        </div>
        
        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
          {[1, 2, 3, 4, 5].map((num) => (
            <a key={num} href={`#feature${num}`} className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                num === 1 ? 'bg-blue-600' : 
                num === 2 ? 'bg-green-600' : 
                num === 3 ? 'bg-purple-600' : 
                num === 4 ? 'bg-yellow-600' : 
                'bg-red-600'
              }`}>
                {num < 10 ? `0${num}` : num}
              </div>
              <div className="hidden md:block ml-2 font-medium">
                {t(`feature${num}_title`).split('|')[1].trim()}
              </div>
              {num < 5 && <div className="mx-2 text-gray-400">→</div>}
            </a>
          ))}
        </div>

        {/* Feature 1 */}
        <div id="feature1" className="mb-24 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-blue-600 font-semibold mb-2">01</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">{t('feature1_title').split('|')[1].trim()}</h3>
            <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: t('feature1_desc') }}></p>
            
            <ul className="mb-8 space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature1_li1')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature1_li2')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature1_li3')}</span>
              </li>
            </ul>
            
            <a href="#" className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-6 rounded-lg transition-colors">
              {t('feature1_cta')}
            </a>
          </div>
          
          <div className="bg-gray-100 p-8 flex justify-center">
            <div className="bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
              <p className="text-gray-500">{t('screenshot_placeholder_text')}</p>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div id="feature2" className="mb-24 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-green-600 font-semibold mb-2">02</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">{t('feature2_title').split('|')[1].trim()}</h3>
            <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: t('feature2_desc') }}></p>
            
            <ul className="mb-8 space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature2_li1')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature2_li2')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature2_li3')}</span>
              </li>
            </ul>
            
            <a href="#" className="inline-block bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg transition-colors">
              {t('feature2_cta')}
            </a>
          </div>
          
          <div className="bg-gray-100 p-8 flex justify-center">
            <div className="bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
              <p className="text-gray-500">{t('screenshot_placeholder_text')}</p>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div id="feature3" className="mb-24 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-purple-600 font-semibold mb-2">03</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">{t('feature3_title').split('|')[1].trim()}</h3>
            <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: t('feature3_desc') }}></p>
            
            <ul className="mb-8 space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature3_li1')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature3_li2')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature3_li3')}</span>
              </li>
            </ul>
            
            <a href="#" className="inline-block bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-3 px-6 rounded-lg transition-colors">
              {t('feature3_cta')}
            </a>
          </div>
          
          <div className="bg-gray-100 p-8 flex justify-center">
            <div className="bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
              <p className="text-gray-500">{t('screenshot_placeholder_text')}</p>
            </div>
          </div>
        </div>

        {/* Feature 4 */}
        <div id="feature4" className="mb-24 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-yellow-600 font-semibold mb-2">04</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">{t('feature4_title').split('|')[1].trim()}</h3>
            <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: t('feature4_desc') }}></p>
            
            <ul className="mb-8 space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature4_li1')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature4_li2')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature4_li3')}</span>
              </li>
            </ul>
            
            <a href="#" className="inline-block bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold py-3 px-6 rounded-lg transition-colors">
              {t('feature4_cta')}
            </a>
          </div>
          
          <div className="bg-gray-100 p-8 flex justify-center">
            <div className="bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
              <p className="text-gray-500">{t('screenshot_placeholder_text')}</p>
            </div>
          </div>
        </div>

        {/* Feature 5 */}
        <div id="feature5" className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-red-600 font-semibold mb-2">05</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">{t('feature5_title').split('|')[1].trim()}</h3>
            <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: t('feature5_desc') }}></p>
            
            <ul className="mb-8 space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature5_li1')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature5_li2')}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('feature5_li3')}</span>
              </li>
            </ul>
            
            <button 
              onClick={onOpenDemoModal}
              className="inline-block bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t('feature5_cta')}
            </button>
          </div>
          
          <div className="bg-gray-100 p-8 flex justify-center">
            <div className="bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
              <p className="text-gray-500">{t('screenshot_placeholder_text')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
