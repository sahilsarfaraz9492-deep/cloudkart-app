pipeline {
  agent any
  environment { IMAGE_TAG = "${BUILD_NUMBER}" }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build Backend') {
      steps { sh 'docker build -t cloudkart-backend:${IMAGE_TAG} ./backend' }
    }
    stage('Build Frontend') {
      steps { sh 'docker build -t cloudkart-frontend:${IMAGE_TAG} ./frontend' }
    }
    stage('Smoke Test') {
      steps {
        sh '''
          docker run -d --name test-backend-${BUILD_NUMBER} cloudkart-backend:${IMAGE_TAG}
          sleep 5
          docker exec test-backend-${BUILD_NUMBER} wget -qO- localhost:3000/health
        '''
      }
    }
  }
  post {
    always { sh 'docker rm -f test-backend-${BUILD_NUMBER} || true' }
  }
}