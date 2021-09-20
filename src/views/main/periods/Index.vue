<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Periodos de mantenimiento
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('periods.create')"
                            @click="$router.push({ name: 'periods.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchPeriod" placeholder="Nombre del periodo"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th>Inicio</th>
                                    <th>Fin</th>
                                    <th>Estado</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="period in periods.data" :key="period.id">
                                        <td>{{ period.name }}</td>
                                        <td>{{ convertDate(period.start) }}</td>
                                        <td>{{ convertDate(period.end) }}</td>
                                        <td>
                                            <div :class="{ 'badge': true, 'badge-success': period.active, 'badge-danger': !period.active }" style="cursor:pointer" @click="updateState(period.id)">
                                                {{ period.active ? 'Activo' : 'Cerrado' }}
                                            </div>
                                        </td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('periods.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'periods.edit', params: { id: period.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deletePeriod(period.id)" :disabled="!hasPermission('periods.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="periods" @pagination-change-page="getPeriods"></pagination>
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
        name: 'periods.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getPeriods()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                periods: {},
                loading: true
            }
        },
        methods: {
            searchPeriod (search) {
                this.loading = true
                this.getPeriods(1, search.search)
            },
            getPeriods (page = 1, search = '') {
                this.$http.get(`periods?page=${ page }&name=${ search }`).then( response => {
                    this.periods = response.data
                    this.loading = false
                })
            },
            deletePeriod (period) {
                this.$http.delete(`periods/${ period }`).then( response => {
                    this.getPeriods()
                    this.$toastr.success('Periodo eliminado')
                })
            },
            updateState (period) {
                this.$http.put(`periods/${ period }/update-state`).then( response => {
                    this.getPeriods()
                    this.$toastr.success('Periodo actualizado')
                })
            },
            convertDate (date) {
                return this.$moment(date).format('DD[-]MMMM[-]Y')
            }
        },
    }
</script>