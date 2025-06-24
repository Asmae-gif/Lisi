import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';

interface Partenaire {
  id: number;
  nom_fr: string;
  nom_en: string;
  nom_ar: string;
  logo: string | null;
  lien: string;
  created_at: string;
  updated_at: string;
}

interface PartenaireFormData {
    nom_fr: string;
    nom_en: string;
    nom_ar: string;
    logo: string;
    lien: string;
}

interface PartenaireFormProps {
    partenaire?: Partenaire | null;
    onSubmit: (data: PartenaireFormData) => void;
    onClose: () => void;
    isSubmitting: boolean;
}

export function PartenaireForm({ partenaire, onSubmit, onClose, isSubmitting }: PartenaireFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = React.useState<PartenaireFormData>({
        nom_fr: partenaire?.nom_fr || '',
        nom_en: partenaire?.nom_en || '',
        nom_ar: partenaire?.nom_ar || '',
        logo: partenaire?.logo || '',
        lien: partenaire?.lien || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {partenaire ? t('partenaires.form.edit') : t('partenaires.form.add')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="fr">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="fr">Français</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="ar">العربية</TabsTrigger>
                        </TabsList>

                        <TabsContent value="fr" className="space-y-4">
                            <div>
                                <Label htmlFor="nom_fr">Nom (FR)</Label>
                                <Input
                                    id="nom_fr"
                                    name="nom_fr"
                                    value={formData.nom_fr}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                        </TabsContent>

                        <TabsContent value="en" className="space-y-4">
                            <div>
                                <Label htmlFor="nom_en">Name (EN)</Label>
                                <Input
                                    id="nom_en"
                                    name="nom_en"
                                    value={formData.nom_en}
                                    onChange={handleChange}
                                />
                            </div>
                           
                        </TabsContent>

                        <TabsContent value="ar" className="space-y-4">
                            <div>
                                <Label htmlFor="nom_ar">الاسم (AR)</Label>
                                <Input
                                    id="nom_ar"
                                    name="nom_ar"
                                    value={formData.nom_ar}
                                    onChange={handleChange}
                                    className="text-right"
                                />
                            </div>
                          
                        </TabsContent>
                    </Tabs>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="logo">URL du Logo</Label>
                            <Input
                                id="logo"
                                name="logo"
                                value={formData.logo}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                            />
                        </div>

                        <div>
                            <Label htmlFor="lien">Site Web</Label>
                            <Input
                                id="lien"
                                name="lien"
                                value={formData.lien}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('common.saving') : t('common.save')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 