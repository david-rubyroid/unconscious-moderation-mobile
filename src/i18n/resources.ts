import enBlinkist from '@/locales/en/blinkist.json'
import enBoxBreathing from '@/locales/en/box-breathing.json'
import enDrinkTracker from '@/locales/en/drink-tracker.json'
import enDrinkWithAwareness from '@/locales/en/drink-with-awareness.json'
import enEditProfile from '@/locales/en/edit-profile.json'
import enExternalResources from '@/locales/en/external-resources.json'
import enForgotPassword from '@/locales/en/forgot-password.json'
import enFreeDrinkTracker from '@/locales/en/free-drink-tracker.json'
import enHome from '@/locales/en/home.json'
import enHydration from '@/locales/en/hydration.json'
import enHypnosisAdventure from '@/locales/en/hypnosis-adventure.json'
import enHypnosis from '@/locales/en/hypnosis.json'
import enIntro from '@/locales/en/intro.json'
import enJournaling from '@/locales/en/journaling.json'
import enLogDrink from '@/locales/en/log-drink.json'
import enLogin from '@/locales/en/login.json'
import enManageUrges from '@/locales/en/manage-urges.json'
import enMantra from '@/locales/en/mantra.json'
import enMedicalReport from '@/locales/en/medical-report.json'
import enMovement from '@/locales/en/movement.json'
import enMyProgress from '@/locales/en/my-progress.json'
import enPhotoRecord from '@/locales/en/photo-record.json'
import enPlanSession from '@/locales/en/plan-session.json'
import enPreDrinkChecklist from '@/locales/en/pre-drink-checklist.json'
import enProfile from '@/locales/en/profile.json'
import enPurchase from '@/locales/en/purchase.json'
import enQuestions from '@/locales/en/questions.json'
import enQuickWriting from '@/locales/en/quick-writing.json'
import enQuotes from '@/locales/en/quotes.json'
import enReading from '@/locales/en/reading.json'
import enReflectReinforce from '@/locales/en/reflect-reinforce.json'
import enRegister from '@/locales/en/register.json'
import enToolkit from '@/locales/en/toolkit.json'
import enTrophies from '@/locales/en/trophies.json'
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
  'en/drink-with-awareness': enDrinkWithAwareness,
  'en/log-drink': enLogDrink,
  'en/quick-writing': enQuickWriting,
  'en/manage-urges': enManageUrges,
  'en/reflect-reinforce': enReflectReinforce,
  'en/free-drink-tracker': enFreeDrinkTracker,
  'en/my-progress': enMyProgress,
  'en/trophies': enTrophies,
  'en/journaling': enJournaling,
  'en/hypnosis-adventure': enHypnosisAdventure,
  'en/edit-profile': enEditProfile,
  'en/reading': enReading,
  'en/box-breathing': enBoxBreathing,
  'en/movement': enMovement,
  'en/quotes': enQuotes,
  'en/blinkist': enBlinkist,
  'en/external-resources': enExternalResources,
  'en/photo-record': enPhotoRecord,
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
