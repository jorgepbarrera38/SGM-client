<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Usuarios
                        </span>
                        <router-link class="btn btn-success btn-sm float-right" :to="{ name: 'users.create' }"><i class="fa fa-plus"></i> Nuevo</router-link>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchUser" placeholder="Nombres o usuario"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombres</th>
                                    <th>Usuario</th>
                                    <th>Soporte técnico</th>
                                    <th>Firma</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="user in users.data" :key="user.id">
                                        <td>{{ user.names }}</td>
                                        <td>{{ user.username }}</td>
                                        <td>
                                            <div :class="{ 'badge': true, 'badge-success': user.technical_support, 'badge-danger': !user.technical_support }">
                                                <i :class="{ fa: true, 'fa-check': user.technical_support, 'fa-times': !user.technical_support }"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <img class="img-fluid" :src="`${ $serverFiles }/${ user.signature }`" width="50" v-if="user.signature">
                                        </td>
                                        <th>
                                            <router-link class="btn btn-warning btn-sm" :to="{ name: 'users.edit', params: { id: user.id } }" style="margin-right:3px">
                                                <i class="fa fa-edit"></i> Editar
                                            </router-link>
                                            <router-link class="btn btn-info btn-sm" :to="{ name: 'users.permissions', params: { id: user.id } }" style="margin-right:3px">
                                                <i class="fa fa-door-open"></i> Permisos
                                            </router-link>
                                            <!--<button class="btn btn-danger btn-sm" @click="deleteUser(user.id)"><i class="fa fa-trash-alt"></i> Eliminar</button>-->
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="users" @pagination-change-page="getUsers"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    import SimpleSearch from '../components/SimpleSearch'
    export default {
        name: 'users.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getUsers()
        },
        data() {
            return {
                users: {},
                loading: true
            }
        },
        methods: {
            searchUser (search) {
                this.loading = true
                this.getUsers(1, search.search)
            },
            getUsers (page = 1, search = '') {
                this.$http.get(`users?page=${ page }&search=${ search }`).then( response => {
                    this.users = response.data
                    this.loading = false
                })
            },
            deleteUser (user) {
                this.$http.delete(`users/${ user }`).then( response => {
                    this.getUsers()
                    this.$toastr.success('Usuario eliminado')
                }).catch(() => {
                    this.$toastr.error('El usuario no se pudo eliminar')
                })
            }
        },
    }
</script>