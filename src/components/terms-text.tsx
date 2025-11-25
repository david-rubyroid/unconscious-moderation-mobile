import type { StyleProp, TextStyle } from 'react-native'

import { Trans } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'

import ExternalLink from './external-link'

const styles = StyleSheet.create({
  terms: {
    fontSize: 11,
    lineHeight: 20,
    fontWeight: 400,
  },
  link: {
    fontWeight: 600,
    textDecorationLine: 'underline',
  },
})

interface TermsTextProps {
  style?: StyleProp<TextStyle>
  linkStyle?: StyleProp<TextStyle>
}

function TermsText({ style, linkStyle }: TermsTextProps) {
  return (
    <Text style={[styles.terms, style]}>
      <Trans
        i18nKey="intro:terms"
        components={[
          <ExternalLink
            key="terms"
            href="https://um.app/terms-and-conditions/"
            style={[styles.link, linkStyle]}
          />,
          <ExternalLink
            key="privacy"
            href="https://um.app/privacy-policy/"
            style={[styles.link, linkStyle]}
          />,
        ]}
      />
    </Text>
  )
}

export default TermsText
