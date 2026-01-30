import type { HypnosisCheckInType } from '@/utils/hypnosis-checkin-storage'

import { useState } from 'react'

interface UseDrinkAwarenessModalsReturn {
  // Manage Urges Modal
  isManageUrgesModalVisible: boolean
  openManageUrgesModal: () => void
  closeManageUrgesModal: () => void

  // Planned Limit Warning Modal
  isPlannedLimitWarningVisible: boolean
  openPlannedLimitWarning: () => void
  closePlannedLimitWarning: () => void

  // Hypnosis Check-In Modal
  isHypnosisModalVisible: boolean
  hypnosisCheckInLink: string | null
  hypnosisCheckInTitle: string | null
  hypnosisCheckInType: HypnosisCheckInType | null
  openHypnosisModal: (_link: string, _title: string, _type: string, _hours: number) => void
  closeHypnosisModal: () => void

  // Finish Drinking Modal
  isFinishDrinkingModalVisible: boolean
  openFinishDrinkingModal: () => void
  closeFinishDrinkingModal: () => void

  // Water Log Success Modal
  isWaterLogSuccessModalVisible: boolean
  openWaterLogSuccessModal: () => void
  closeWaterLogSuccessModal: () => void
}

export function useDrinkAwarenessModals(): UseDrinkAwarenessModalsReturn {
  const [isManageUrgesModalVisible, setIsManageUrgesModalVisible] = useState(false)
  const [isPlannedLimitWarningVisible, setIsPlannedLimitWarningVisible] = useState(false)
  const [isHypnosisModalVisible, setIsHypnosisModalVisible] = useState(false)
  const [isFinishDrinkingModalVisible, setIsFinishDrinkingModalVisible] = useState(false)
  const [isWaterLogSuccessModalVisible, setIsWaterLogSuccessModalVisible] = useState(false)
  const [hypnosisCheckInLink, setHypnosisCheckInLink] = useState<string | null>(null)
  const [hypnosisCheckInTitle, setHypnosisCheckInTitle] = useState<string | null>(null)
  const [hypnosisCheckInType, setHypnosisCheckInType] = useState<HypnosisCheckInType | null>(null)

  const openManageUrgesModal = () => {
    setIsManageUrgesModalVisible(true)
  }

  const closeManageUrgesModal = () => {
    setIsManageUrgesModalVisible(false)
  }

  const openPlannedLimitWarning = () => {
    setIsPlannedLimitWarningVisible(true)
  }

  const closePlannedLimitWarning = () => {
    setIsPlannedLimitWarningVisible(false)
  }

  const openHypnosisModal = (link: string, title: string, type: string, _hours: number) => {
    setHypnosisCheckInLink(link)
    setHypnosisCheckInTitle(title)
    setHypnosisCheckInType(type as HypnosisCheckInType)
    setIsHypnosisModalVisible(true)
  }

  const closeHypnosisModal = () => {
    setIsHypnosisModalVisible(false)
  }

  const openFinishDrinkingModal = () => {
    setIsFinishDrinkingModalVisible(true)
  }

  const closeFinishDrinkingModal = () => {
    setIsFinishDrinkingModalVisible(false)
  }

  const openWaterLogSuccessModal = () => {
    setIsWaterLogSuccessModalVisible(true)
  }

  const closeWaterLogSuccessModal = () => {
    setIsWaterLogSuccessModalVisible(false)
  }

  return {
    isManageUrgesModalVisible,
    openManageUrgesModal,
    closeManageUrgesModal,

    isPlannedLimitWarningVisible,
    openPlannedLimitWarning,
    closePlannedLimitWarning,

    isHypnosisModalVisible,
    hypnosisCheckInLink,
    hypnosisCheckInTitle,
    hypnosisCheckInType,
    openHypnosisModal,
    closeHypnosisModal,

    isFinishDrinkingModalVisible,
    openFinishDrinkingModal,
    closeFinishDrinkingModal,

    isWaterLogSuccessModalVisible,
    openWaterLogSuccessModal,
    closeWaterLogSuccessModal,
  }
}
