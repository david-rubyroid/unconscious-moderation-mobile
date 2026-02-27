Pod::Spec.new do |s|
  s.name           = 'ExpoTikTokBusinessModule'
  s.version        = '1.0.0'
  s.summary        = 'Custom Expo module for TikTok Business SDK integration'
  s.description    = 'A custom Expo module that integrates TikTok Business SDK for iOS app event tracking'
  s.author         = ''
  s.homepage       = 'https://github.com/expo/expo'
  s.platform       = :ios, '13.0'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  
  # TikTok Business SDK (latest version is 1.6.0)
  s.dependency 'TikTokBusinessSDK', '~> 1.6'

  # Define the source files for the module
  s.source_files = "**/*.{h,m,swift}"
end
