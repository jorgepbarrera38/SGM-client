<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Grupos
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('groups.create')"
                            @click="$router.push({ name: 'groups.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchGroup" placeholder="Nombre del grupo"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="group in groups.data" :key="group.id">
                                        <td>{{ group.name }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('groups.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'groups.edit', params: { id: group.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteGroup(group.id)" :disabled="!hasPermission('groups.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>

                                            <button class="btn btn-primary btn-sm" :disabled="!hasPermission('groups.destroy')"
                                                @click="$router.push({ name: 'groups.authorization', params: { id: group.id } })">
                                                <i class="fa fa-door-open"></i> Autorización
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="groups" @pagination-change-page="getGroups"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import SimpleSearch from '../components/SimpleSearch'
    export default {
        mixins: [ hasPermission ],
        name: 'groups.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getGroups()
        },
        data() {
            return {
                groups: {},
                loading: true
            }
        },
        methods: {
            searchGroup (search) {
                this.loading = true
                this.getGroups(1, search.search)
            },
            getGroups (page = 1, search = '') {
                this.$http.get(`groups?page=${ page }&name=${ search }`).then( response => {
                    this.groups = response.data
                    this.loading = false
                })
            },
            deleteGroup (group) {
                this.$http.delete(`groups/${ group }`).then( response => {
                    this.getGroups()
                    this.$toastr.success('Grupo eliminado')
                }).catch(() => {
                    this.$toastr.error('El grupo no se pudo eliminar')
                })
            }
        },
    }
</script>