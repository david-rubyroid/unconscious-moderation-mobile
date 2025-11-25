import { StyleSheet, Text, View } from 'react-native'

import { Colors } from '@/constants/theme'

const styles = StyleSheet.create({
  successContainer: {
    height: 'auto',
    width: '90%',
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary2,
    shadowColor: Colors.light.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  successContent: {
    flex: 1,
  },
  successText1: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  successText2: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.light.gray1,
    lineHeight: 20,
  },
  errorContainer: {
    height: 'auto',
    width: '90%',
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.error,
    shadowColor: Colors.light.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  errorContent: {
    flex: 1,
  },
  errorText1: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  errorText2: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.light.gray1,
    lineHeight: 20,
  },
  infoContainer: {
    height: 'auto',
    width: '90%',
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary4,
    shadowColor: Colors.light.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoText1: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  infoText2: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.light.gray1,
    lineHeight: 20,
  },
})

export const toastConfig = {
  success: ({ text1, text2 }: { text1?: string, text2?: string }) => (
    <View style={styles.successContainer}>
      <View style={styles.successContent}>
        <Text style={styles.successText1}>{text1}</Text>
        {text2 && <Text style={styles.successText2}>{text2}</Text>}
      </View>
    </View>
  ),
  error: ({ text1, text2 }: { text1?: string, text2?: string }) => (
    <View style={styles.errorContainer}>
      <View style={styles.errorContent}>
        <Text style={styles.errorText1}>{text1}</Text>
        {text2 && <Text style={styles.errorText2}>{text2}</Text>}
      </View>
    </View>
  ),
  info: ({ text1, text2 }: { text1?: string, text2?: string }) => (
    <View style={styles.infoContainer}>
      <View style={styles.infoContent}>
        <Text style={styles.infoText1}>{text1}</Text>
        {text2 && <Text style={styles.infoText2}>{text2}</Text>}
      </View>
    </View>
  ),
}
