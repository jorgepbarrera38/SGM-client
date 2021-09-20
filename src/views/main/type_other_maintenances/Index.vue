<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Clasificación de servicios
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('type-other-maintenances.create')"
                            @click="$router.push({ name: 'type_other_maintenances.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchTypeOtherMaintenance" placeholder="Nombre de clasificación"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="typeOtherMaintenance in typeOtherMaintenances.data" :key="typeOtherMaintenance.id">
                                        <td>{{ typeOtherMaintenance.name }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('type-other-maintenances.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'type_other_maintenances.edit', params: { id: typeOtherMaintenance.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteTypeOtherMaintenance(typeOtherMaintenance.id)" :disabled="!hasPermission('type-other-maintenances.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="typeOtherMaintenances" @pagination-change-page="getTypeOtherMaintenances"></pagination>
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
        name: 'typeOtherMaintenances.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getTypeOtherMaintenances()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                typeOtherMaintenances: {},
                loading: true
            }
        },
        methods: {
            searchTypeOtherMaintenance (search) {
                this.loading = true
                this.getTypeOtherMaintenances(1, search.search)
            },
            getTypeOtherMaintenances (page = 1, search = '') {
                this.$http.get(`type-other-maintenances?page=${ page }&name=${ search }`).then( response => {
                    this.typeOtherMaintenances = response.data
                    this.loading = false
                })
            },
            deleteTypeOtherMaintenance (typeOtherMaintenance) {
                this.$http.delete(`type-other-maintenances/${ typeOtherMaintenance }`).then( response => {
                    this.getTypeOtherMaintenances()
                    this.$toastr.success('Registro eliminado')
                })
            }
        },
    }
</script>