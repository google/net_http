Pod::Spec.new do |s|
  s.name             = 'WebChannel'
  s.version          = '0.1.0'
  s.summary          = 'Objective-C client for WebChannel'
  s.description      = <<-DESC
Objective-C client implementation for WebChannel, providing robust bidirectional
communication over HTTP.
                       DESC
  s.homepage         = 'https://github.com/google/net_http'
  s.license          = { :type => 'Apache License, Version 2.0', :file => '../../LICENSE' }
  s.author           = { 'Google LLC' => 'webchannel-dev@google.com' }
  s.source           = { :git => 'https://github.com/google/net_http.git', :tag => s.version.to_s }

  s.ios.deployment_target = '12.0'
  s.osx.deployment_target = '10.15'

  s.source_files = 'imported_src/**/*.{h,m}'
  s.exclude_files = 'imported_src/Tests/**/*.{h,m}'

  s.dependency 'GTMSessionFetcher', '~> 3.0'

  s.test_spec 'Tests' do |test_spec|
    test_spec.source_files = 'imported_src/Tests/**/*.{h,m}'
    test_spec.dependency 'OCMock', '~> 3.0'
  end
end
