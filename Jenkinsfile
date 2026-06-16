pipeline {
    agent any
    stages {
        stage('Verificar Repositório') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], useRemoteConfigs: [[url: 'https://github.com/Gustasilvadev/schoolManager-api-gateway']]])
            }
        }
        
        stage('Instalar Dependências') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                script {
                    env.PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin;${env.PATH}"

                    def appName = 'schoolmanager-gateway'
                    def imageTag = "${appName}:${env.BUILD_ID}"

                    bat "docker build -t ${imageTag} ."
                }
            }
        }

        stage('Fazer Deploy') {
            steps {
                script {
                    def appName = 'schoolmanager-gateway'
                    def imageTag = "${appName}:${env.BUILD_ID}"

                    bat "docker stop ${appName} || echo 0"
                    bat "docker rm -v ${appName} || echo 0"
                    bat "docker run -d --name ${appName} -p 9517:9517 ${imageTag}"
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy realizado com sucesso!'
        }
        failure {
            echo 'Houve um erro durante o deploy.'
        }
    }
}
