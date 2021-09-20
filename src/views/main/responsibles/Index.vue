<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Responsables
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('responsibles.create')"
                            @click="$router.push({ name: 'responsibles.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchResponsible" placeholder="Identificación o nombres"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Identificación</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="responsible in responsibles.data" :key="responsible.id">
                                        <td>{{ responsible.identification }}</td>
                                        <td>{{ responsible.names }}</td>
                                        <td>{{ responsible.lastnames }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('responsibles.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'responsibles.edit', params: { id: responsible.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteResponsible(responsible.id)" :disabled="!hasPermission('responsibles.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="responsibles" @pagination-change-page="getResponsibles"></pagination>
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
        name: 'responsibles.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        mixins: [ hasPermission ],
        created () {
            this.getResponsibles()
        },
        data() {
            return {
                responsibles: {},
                loading: true
            }
        },
        methods: {
            searchResponsible (search) {
                this.loading = true
                this.getResponsibles(1, search.search)
            },
            getResponsibles (page = 1, search = '') {
                this.$http.get(`responsibles?page=${ page }&search=${ search }`).then( response => {
                    console.log(response.data);
                    this.responsibles = response.data
                    this.loading = false
                })
            },
            deleteResponsible (responsible) {
                this.$http.delete(`responsibles/${ responsible }`).then( response => {
                    this.getResponsibles()
                    this.$toastr.success('Responsable eliminado')
                }).catch(() => {
                    this.$toastr.error('El responsable no se pudo eliminar')
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>