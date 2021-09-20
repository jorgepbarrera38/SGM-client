<template>
<div>
    <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
            <a class="navbar-brand" href="#" @click.prevent="">SGM {{ complementTitle ? ' - ' + complementTitle : '' }}</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            </nav>
            <div class="container" style="margin-top:90px">
                <div class="row">
                    <div class="col-md-4 offset-md-4">
                        <div class="card">
                            <div class="card-header">Iniciar sesión</div>
                            <div class="card-body">
                                <form @submit.prevent="login">
                                    <div class="form-group">
                                        <label for="">Usuario</label>
                                        <input type="text" class="form-control" v-model="user.username">
                                    </div>
                                    <div class="form-group">
                                        <label for="">Contraseña</label>
                                        <input type="password" class="form-control" v-model="user.password">
                                    </div>
                                    <vue-loading v-if="logining" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                                    <button v-else class="btn btn-primary btn-block" type="submit">
                                        <i class="fa fa-sign-in-alt"></i> Login
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
</div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    import axios from 'axios'
    export default {
        name: 'login',
        components: {
            VueLoading
        },
        data() {
            return {
                user: {
                    username: '',
                    password: ''
                },
                logining: false
            }
        },
        methods: {
            login () {
                this.logining = true
                this.$http.post('auth/login', this.user).then( response => {
                    let complementTitle = response.data.company.complementTitle
                    localStorage.setItem('complementTitle', complementTitle ? complementTitle : '')
                    this.logining = false
                    localStorage.setItem('access_token', response.data.access_token)
                    localStorage.setItem('permissions', JSON.stringify(response.data.user.permissions))
                    axios.defaults.headers.common['authorization'] = `bearer ${ response.data.access_token }`
                    this.$router.push({ name: 'main' })
                    localStorage.setItem('locationSearch', '')
                    localStorage.setItem('dependenceSearch', '')
                    localStorage.setItem('responsibleSearch', '')
                }).catch(error => {
                    this.logining = false
                    if (error.response.status == 401) {
                        this.$toastr.error('Usuario o contraseña erróneos')
                    }
                })
            }
        },
        computed: {
            complementTitle () {
                return localStorage.getItem('complementTitle')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>