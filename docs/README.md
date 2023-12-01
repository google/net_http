## Installation

Too install on linux ubuntu machine:  

### First install Bazel:  

1. Install dependency:  
`sudo apt-get update && sudo apt-get install apt-transport-https curl gnupg build-essential cmake git unzip pkg-config`  

2. Add Bazel's APT Repository:  
`curl -fsSL https://bazel.build/bazel-release.pub.gpg | gpg --dearmor -o /usr/share/keyrings/bazel-archive-keyring.gpg`  

3. Now add Bazel's APT repository to the system:  
`echo "deb [arch=amd64 signed-by=/usr/share/keyrings/bazel-archive-keyring.gpg] https://storage.googleapis.com/bazel-apt stable jdk1.8" | sudo tee /etc/apt/sources.list.d/bazel.list`  

4. Install Bazel:  
`sudo apt-get update && sudo apt-get install bazel`  
or In our case we want to use Bazel 5.4.0:  
`sudo apt-get install bazel-<version>`

5. Verify Installation:  
`bazel --version`

### Then Install libvirt:  
```
sudo apt-get update
sudo apt-get install -y autoconf automake libtool
```

### Add Google Benchmark:
```
sudo apt-get install libbenchmark-dev
```

## To Build:  

Under the project root dir:  
`bazel build //net_http/server/public:http_server`