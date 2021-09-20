<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        Usuarios
                        <div class="float-right">
                            <router-link class="btn btn-secondary btn-sm" :to="{ name: 'groups.index' }" style="margin-right:3px">
                                <i class="fa fa-undo"></i> Atrás
                            </router-link>
                        </div>
                    </div>
                    <div class="card-body">
                        <input type="text" class="form-control mb-2" placeholder="Buscar por nombres" v-model="nameFromSearchUser">
                        <div class="table-responsive" style="max-height:400px;overflow:auto">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th></th>
                                    <th>Nombres</th>
                                    <th>Cargo</th>
                                </thead>
                                <tbody>
                                    <tr v-for="user in usersFiltered" :key="user.id">
                                        <td>
                                            <button class="btn btn-success btn-sm" @click="authorizeUserInGroup(user)"><i class="fa fa-plus"></i></button>
                                        </td>
                                        <td>{{ user.names }}</td>
                                        <td>{{ user.official_position }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        Autorización de usuarios en grupo: <strong>{{ group.name }}</strong>
                        <div class="float-right">
                            <button class="btn btn-primary btn-sm" @click="authorizeUsersInGroup" :disabled="updating">
                                <div class="spinner-border spinner-border-sm" role="status" v-if="updating">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <i class="fa fa-save" v-else></i> Guardar
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                            <li v-for="(error, index) in errors" :key="index">
                                {{ error[0] }}
                            </li>
                        </div>
                        <input type="text" class="form-control mb-2" placeholder="Buscar por nombres" v-model="nameFromSearchUserAdded">
                        <div class="table-responsive" style="max-height:400px;overflow:auto">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombres</th>
                                    <th>Cargo</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="(user, index) in usersFromGroupFiltered" :key="`group-user${ index }`">
                                        <td>{{ user.names }}</td>
                                        <td>{{ user.official_position }}</td>
                                        <td>
                                            <button class="btn btn-danger btn-sm" @click="deleteUserFromGroup(index)"><i class="fa fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    export default {
        name: 'groups.authorization',
        components: {
            VueLoading
        },
        created () {
            this.getUsersToAuthorize()
        },
        data() {
            return {
                group: {
                    users: []
                },
                users: [],
                nameFromSearchUser: '',
                nameFromSearchUserAdded: '',
                errors: {},
                updating: false
            }
        },
        methods: {
            getUsersToAuthorize () {
                this.$http.get(`groups/${ this.$route.params.id }/get-users-to-authorize`).then( response => {
                    this.users = response.data.users
                    this.group = response.data.group
                })
            },
            authorizeUserInGroup (user) {
                let userFoundedInUserListGroup = this.group.users.find(userGroup => userGroup.username == user.username )

                if (userFoundedInUserListGroup) {
                    return this.$toastr.info('El usuario ya se encuentra en la lista')
                }

                this.group.users.push(user)
            },
            authorizeUsersInGroup() {
                this.updating = true
                this.$http.post(`groups/${ this.$route.params.id }/authorize-users-in-group`, { users: this.group.users }).then( response => {
                    this.updating = false
                    return this.$toastr.success('Autorización de grupo actualizada')
                }).catch(error => {
                    this.updating = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            deleteUserFromGroup(index) {
                this.group.users.splice(index, 1)
            }
        },
        computed: {
            usersFiltered() {
                return this.users.filter(user => {
                    return user.names.toLowerCase().includes(this.nameFromSearchUser.toLowerCase())
                })
            },
            usersFromGroupFiltered() {
                return this.group.users.filter(user => {
                    return user.names.toLowerCase().includes(this.nameFromSearchUserAdded.toLowerCase())
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>