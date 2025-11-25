import enEndOfFreeTrial from '@/locales/en/end-of-free-trial.json'
import enForgotPassword from '@/locales/en/forgot-password.json'
import enIntro from '@/locales/en/intro.json'
import enLogin from '@/locales/en/login.json'
import enMedicalReport from '@/locales/en/medical-report.json'
import enPurchase from '@/locales/en/purchase.json'
import enQuestions from '@/locales/en/questions.json'
import enRegister from '@/locales/en/register.json'
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
  'en/end-of-free-trial': enEndOfFreeTrial,
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
