pipeline {
  agent { label 'jnode' }
  stages { 
    stage('Docker Build') {
      steps {
        sh "echo ${env.BUILD_NUMBER}"
        sh "docker build --no-cache -t shreyasunhale/frontend:${env.BUILD_NUMBER} ."
      }
    }
    
    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: '364b7bb1-fb49-459d-8bf7-8767b28a2808', passwordVariable: 'Password', usernameVariable: 'Username')]) {
          sh "docker login -u ${env.Username} -p ${env.Password}"
          sh "docker push shreyasunhale/frontend:${env.BUILD_NUMBER}"
        }
      }
    }
    
    stage('Launch Container') {
      steps {
        sh "docker run -d --restart=always --name angular -p 80:80 shreyasunhale/frontend:${env.BUILD_NUMBER}"
      }
    }    
  }
  post {
    always {
      deleteDir() /* cleanup the workspace */
    }
  }
}
