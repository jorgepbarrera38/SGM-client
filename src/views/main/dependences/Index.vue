<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Dependencias
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('dependences.create')"
                            @click="$router.push({ name: 'dependences.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchDependence" placeholder="Nombre de la dependencia"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="dependence in dependences.data" :key="dependence.id">
                                        <td>{{ dependence.name }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('dependences.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'dependences.edit', params: { id: dependence.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteDependence(dependence.id)" :disabled="!hasPermission('dependences.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="dependences" @pagination-change-page="getDependences"></pagination>
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
        name: 'dependences.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        mixins: [ hasPermission ],
        created () {
            this.getDependences()
        },
        data() {
            return {
                dependences: {},
                loading: true
            }
        },
        methods: {
            searchDependence (search) {
                this.loading = true
                this.getDependences(1, search.search)
            },
            getDependences (page = 1, search = '') {
                this.$http.get(`dependences?page=${ page }&name=${ search }`).then( response => {
                    this.dependences = response.data
                    this.loading = false
                })
            },
            deleteDependence (dependence) {
                this.$http.delete(`dependences/${ dependence }`).then( response => {
                    this.getDependences()
                    this.$toastr.success('Dependencia eliminada')
                }).catch(() => {
                    this.$toastr.error('La dependencia no se pudo eliminar')
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>