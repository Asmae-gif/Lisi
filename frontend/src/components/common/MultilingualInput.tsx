import React from 'react';

interface MultilingualInputProps {
    name: string;
    values: {
        fr: string;
        en: string;
        ar: string;
    };
    errors?: {
        fr?: string;
        en?: string;
        ar?: string;
    };
    onChange: (name: string, value: string) => void;
    label: string;
    isRequired?: boolean;
    type?: 'text' | 'textarea';
    placeholder?: {
        fr: string;
        en: string;
        ar: string;
    };
}

const MultilingualInput: React.FC<MultilingualInputProps> = ({
    name,
    values,
    errors,
    onChange,
    label,
    isRequired = false,
    type = 'text',
    placeholder = {
        fr: '',
        en: '',
        ar: ''
    }
}) => {
    const InputComponent = type === 'textarea' ? 'textarea' : 'input';

    const commonProps = {
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name: fieldName, value } = e.target;
            const lang = fieldName.split('_').pop();
            onChange(name, value);
        },
        className: (lang: string) => `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors?.[lang as keyof typeof errors] ? 'border-red-500' : 'border-gray-300'
        } ${lang === 'ar' ? 'text-right' : ''}`,
        ...(type === 'textarea' ? { rows: 4 } : {})
    };

    return (
        <div className="space-y-4">
            {/* Français */}
            <div>
                <label htmlFor={`${name}_fr`} className="block text-sm font-medium text-gray-700 mb-2">
                    {label} (Français) {isRequired && '*'}
                </label>
                <InputComponent
                    id={`${name}_fr`}
                    name={`${name}_fr`}
                    value={values.fr}
                    placeholder={placeholder.fr}
                    className={commonProps.className('fr')}
                    onChange={commonProps.onChange}
                    {...(type === 'textarea' ? { rows: 4 } : { type })}
                />
                {errors?.fr && <p className="text-red-500 text-sm mt-1">{errors.fr}</p>}
            </div>

            {/* Anglais */}
            <div>
                <label htmlFor={`${name}_en`} className="block text-sm font-medium text-gray-700 mb-2">
                    {label} (Anglais)
                </label>
                <InputComponent
                    id={`${name}_en`}
                    name={`${name}_en`}
                    value={values.en}
                    placeholder={placeholder.en}
                    className={commonProps.className('en')}
                    onChange={commonProps.onChange}
                    {...(type === 'textarea' ? { rows: 4 } : { type })}
                />
                {errors?.en && <p className="text-red-500 text-sm mt-1">{errors.en}</p>}
            </div>

            {/* Arabe */}
            <div>
                <label htmlFor={`${name}_ar`} className="block text-sm font-medium text-gray-700 mb-2">
                    {label} (Arabe)
                </label>
                <InputComponent
                    id={`${name}_ar`}
                    name={`${name}_ar`}
                    value={values.ar}
                    placeholder={placeholder.ar}
                    className={commonProps.className('ar')}
                    onChange={commonProps.onChange}
                    dir="rtl"
                    {...(type === 'textarea' ? { rows: 4 } : { type })}
                />
                {errors?.ar && <p className="text-red-500 text-sm mt-1">{errors.ar}</p>}
            </div>
        </div>
    );
};

export default MultilingualInput;