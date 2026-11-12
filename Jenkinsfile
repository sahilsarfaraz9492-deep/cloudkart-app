pipeline {
  agent any
  environment {
    IMAGE_TAG = "${BUILD_NUMBER}"
    DOCKERHUB_USER = "your-dockerhub-username"
  }
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
    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker tag cloudkart-backend:${IMAGE_TAG} ${DOCKERHUB_USER}/cloudkart-backend:${IMAGE_TAG}
            docker tag cloudkart-frontend:${IMAGE_TAG} ${DOCKERHUB_USER}/cloudkart-frontend:${IMAGE_TAG}
            docker push ${DOCKERHUB_USER}/cloudkart-backend:${IMAGE_TAG}
            docker push ${DOCKERHUB_USER}/cloudkart-frontend:${IMAGE_TAG}
          '''
        }
      }
    }
  }
  post {
    always {
      sh 'docker rm -f test-backend-${BUILD_NUMBER} || true'
      sh 'docker logout || true'
    }
  }
}