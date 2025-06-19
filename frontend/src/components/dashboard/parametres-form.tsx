"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

const generalFormSchema = z.object({
  nomLaboratoire: z.string().min(2, {
    message: "Le nom du laboratoire doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  adresse: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères.",
  }),
  telephone: z.string().min(8, {
    message: "Le numéro de téléphone doit contenir au moins 8 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
})

const emailFormSchema = z.object({
  smtpServer: z.string().min(1, {
    message: "Le serveur SMTP est requis.",
  }),
  smtpPort: z.string().min(1, {
    message: "Le port SMTP est requis.",
  }),
  smtpUser: z.string().min(1, {
    message: "L'utilisateur SMTP est requis.",
  }),
  smtpPassword: z.string().min(1, {
    message: "Le mot de passe SMTP est requis.",
  }),
  emailFrom: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
})

const securityFormSchema = z.object({
  enableRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  enableCaptcha: z.boolean(),
  sessionTimeout: z.string().min(1, {
    message: "Le délai d'expiration de session est requis.",
  }),
})

type GeneralFormValues = z.infer<typeof generalFormSchema>
type EmailFormValues = z.infer<typeof emailFormSchema>
type SecurityFormValues = z.infer<typeof securityFormSchema>

export function ParametresForm() {
  const generalForm = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      nomLaboratoire: "Laboratoire d'Informatique et de Systèmes Intelligents",
      description:
        "Le LISI est un laboratoire universitaire dédié à la recherche appliquée dans les domaines des systèmes intelligents, de la modélisation des données, de l'intelligence artificielle et du développement logiciel.",
      adresse: "Faculté des Sciences Semlalia, Université Cadi Ayyad, Marrakech, Maroc",
      telephone: "+212 5 24 43 46 49",
      email: "contact@lisi.uca.ac.ma",
    },
  })

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      smtpServer: "smtp.uca.ac.ma",
      smtpPort: "587",
      smtpUser: "lisi.noreply",
      smtpPassword: "••••••••••••",
      emailFrom: "noreply@lisi.uca.ac.ma",
    },
  })

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      enableRegistration: true,
      requireEmailVerification: true,
      enableCaptcha: true,
      sessionTimeout: "120",
    },
  })

  function onGeneralSubmit(data: GeneralFormValues) {
    console.log(data)
  }

  function onEmailSubmit(data: EmailFormValues) {
    console.log(data)
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    console.log(data)
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full md:w-auto grid-cols-3">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres généraux</CardTitle>
            <CardDescription>Configurez les informations générales du laboratoire LISI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                <FormField
                  control={generalForm.control}
                  name="nomLaboratoire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du laboratoire</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Le nom complet du laboratoire tel qu'il apparaîtra sur le portail.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={generalForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormDescription>Une brève description du laboratoire et de ses activités.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={generalForm.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={generalForm.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="bg-lisi-green hover:bg-lisi-green/90">
                  Enregistrer
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Configuration des emails</CardTitle>
            <CardDescription>Configurez les paramètres d'envoi d'emails pour les notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={emailForm.control}
                    name="smtpServer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serveur SMTP</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="smtpPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port SMTP</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={emailForm.control}
                    name="smtpUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Utilisateur SMTP</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="smtpPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe SMTP</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={emailForm.control}
                  name="emailFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email d'expédition</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        L'adresse email qui apparaîtra comme expéditeur des notifications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-lisi-green hover:bg-lisi-green/90">
                  Enregistrer
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de sécurité</CardTitle>
            <CardDescription>Configurez les options de sécurité et d'authentification.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                <FormField
                  control={securityForm.control}
                  name="enableRegistration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Inscription publique</FormLabel>
                        <FormDescription>Permettre aux utilisateurs de s'inscrire sur le portail.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={securityForm.control}
                  name="requireEmailVerification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Vérification d'email</FormLabel>
                        <FormDescription>Exiger la vérification de l'email lors de l'inscription.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={securityForm.control}
                  name="enableCaptcha"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">CAPTCHA</FormLabel>
                        <FormDescription>Activer le CAPTCHA pour les formulaires publics.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={securityForm.control}
                  name="sessionTimeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Délai d'expiration de session (minutes)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" />
                      </FormControl>
                      <FormDescription>Durée d'inactivité avant déconnexion automatique.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-lisi-green hover:bg-lisi-green/90">
                  Enregistrer
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
