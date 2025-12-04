import enDrinkTracker from '@/locales/en/drink-tracker.json'
import enForgotPassword from '@/locales/en/forgot-password.json'
import enHome from '@/locales/en/home.json'
import enHydration from '@/locales/en/hydration.json'
import enHypnosis from '@/locales/en/hypnosis.json'
import enIntro from '@/locales/en/intro.json'
import enLogin from '@/locales/en/login.json'
import enMantra from '@/locales/en/mantra.json'
import enMedicalReport from '@/locales/en/medical-report.json'
import enPlanSession from '@/locales/en/plan-session.json'
import enPreDrinkChecklist from '@/locales/en/pre-drink-checklist.json'
import enProfile from '@/locales/en/profile.json'
import enPurchase from '@/locales/en/purchase.json'
import enQuestions from '@/locales/en/questions.json'
import enRegister from '@/locales/en/register.json'
import enToolkit from '@/locales/en/toolkit.json'

import enWelcomeToYourJourney from '@/locales/en/welcome-to-your-journey.json'

const localeFiles = {
  'en/intro': enIntro,
  'en/login': enLogin,
  'en/register': enRegister,
  'en/forgot-password': enForgotPassword,
  'en/purchase': enPurchase,
  'en/questions': enQuestions,
  'en/medical-report': enMedicalReport,
  'en/welcome-to-your-journey': enWelcomeToYourJourney,
  'en/profile': enProfile,
  'en/home': enHome,
  'en/toolkit': enToolkit,
  'en/drink-tracker': enDrinkTracker,
  'en/plan-session': enPlanSession,
  'en/pre-drink-checklist': enPreDrinkChecklist,
  'en/hydration': enHydration,
  'en/hypnosis': enHypnosis,
  'en/mantra': enMantra,
}

export function getResources() {
  const result: Record<string, Record<string, any>> = {}

  Object.entries(localeFiles).forEach(([path, content]) => {
    const [lang, namespace] = path.split('/')
    if (!result[lang]) {
      result[lang] = {}
    }
    result[lang][namespace] = content
  })

  return result
}
