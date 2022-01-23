<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Modos de falla
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('failure-modes.create')"
                            @click="$router.push({ name: 'failureModes.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchFailureMode" placeholder="Nombre"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="failureMode in failureModes.data" :key="failureMode.id">
                                        <td>{{ failureMode.name }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('failure-modes.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'failureModes.edit', params: { id: failureMode.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteFailureMode(failureMode.id)" :disabled="!hasPermission('failure-modes.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="failureModes" @pagination-change-page="getFailureModes"></pagination>
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
        name: 'failureModes.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getFailureModes()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                failureModes: {},
                loading: true
            }
        },
        methods: {
            searchFailureMode (search) {
                this.loading = true
                this.getFailureModes(1, search.search)
            },
            getFailureModes (page = 1, search = '') {
                this.$http.get(`failure-modes?page=${ page }&name=${ search }`).then( response => {
                    this.failureModes = response.data
                    this.loading = false
                })
            },
            deleteFailureMode (failureMode) {
                this.$http.delete(`failure-modes/${ failureMode }`).then( response => {
                    this.getFailureModes()
                    this.$toastr.success('Modo de falla eliminado')
                }).catch(() => {
                    this.$toastr.error('El modo de falla no se pudo eliminar')
                })
            }
        },
    }
</script>