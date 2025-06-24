import React from 'react';

interface LanguageFieldsProps {
    lang: 'fr' | 'en' | 'ar';
    label: string;
    values: {
        titre: string;
        description: string;
    };
    errors?: {
        titre?: string;
        description?: string;
    };
    onChange: (field: string, value: string) => void;
    isRequired?: boolean;
}

const LanguageFields: React.FC<LanguageFieldsProps> = ({
    lang,
    label,
    values,
    errors,
    onChange,
    isRequired = false
}) => {
    const placeholders = {
        fr: {
            titre: "Prix d'Excellence en Recherche",
            description: "Description détaillée du prix ou de la distinction..."
        },
        en: {
            titre: "Research Excellence Award",
            description: "Detailed description of the award or distinction..."
        },
        ar: {
            titre: "جائزة التميز في البحث",
            description: "وصف مفصل للجائزة أو التميز..."
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor={`titre_${lang}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Titre ({label}) {isRequired && '*'}
                </label>
                <input
                    type="text"
                    id={`titre_${lang}`}
                    name={`titre_${lang}`}
                    value={values.titre}
                    onChange={(e) => onChange('titre', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors?.titre ? 'border-red-500' : 'border-gray-300'
                    } ${lang === 'ar' ? 'text-right' : ''}`}
                    placeholder={`Ex: ${placeholders[lang].titre}`}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
                {errors?.titre && (
                    <p className="text-red-500 text-sm mt-1">{errors.titre}</p>
                )}
            </div>

            <div>
                <label htmlFor={`description_${lang}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Description ({label}) {isRequired && '*'}
                </label>
                <textarea
                    id={`description_${lang}`}
                    name={`description_${lang}`}
                    value={values.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors?.description ? 'border-red-500' : 'border-gray-300'
                    } ${lang === 'ar' ? 'text-right' : ''}`}
                    placeholder={placeholders[lang].description}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
                {errors?.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
            </div>
        </div>
    );
};

export default LanguageFields;