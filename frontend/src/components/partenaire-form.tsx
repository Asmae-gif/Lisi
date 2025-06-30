import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';
import { isValidImageUrl, handleImageError } from '@/utils/imageUtils';

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
        
        // Validation côté client
        if (!formData.nom_fr.trim()) {
            alert('Le nom en français est requis');
            return;
        }
        
        if (!formData.lien.trim()) {
            alert('Le lien du site web est requis');
            return;
        }
        
        // Vérifier que le lien est une URL valide
        try {
            new URL(formData.lien);
        } catch {
            alert('Veuillez entrer une URL valide pour le site web (ex: https://example.com)');
            return;
        }
        
        // Vérifier que le logo est une URL valide si fourni
        if (formData.logo.trim()) {
            try {
                new URL(formData.logo);
                if (!isValidImageUrl(formData.logo)) {
                    alert('L\'URL fournie ne semble pas être une image valide. Veuillez vérifier que l\'URL pointe vers une image (jpg, png, gif, svg, etc.)');
                    return;
                }
            } catch {
                alert('Veuillez entrer une URL valide pour le logo (ex: https://example.com/logo.png)');
                return;
            }
        }
        
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
                        {partenaire ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
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
                            {formData.logo && (
                                <div className="mt-2">
                                    <Label className="text-sm text-gray-600">Aperçu du logo :</Label>
                                    <div className="mt-1 h-20 bg-gray-50 border rounded-lg flex items-center justify-center">
                                        <img 
                                            src={formData.logo} 
                                            alt="Aperçu du logo"
                                            className="max-h-full max-w-full object-contain"
                                            onError={handleImageError}
                                        />
                                        <div className="text-gray-400 text-sm" style={{display: 'none'}}>
                                            Impossible de charger l'image
                                        </div>
                                    </div>
                                </div>
                            )}
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
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 