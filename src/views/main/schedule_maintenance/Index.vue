<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Cronogramas de mantenimiento
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('schedule-maintenance.create')"
                            @click="$router.push({ name: 'schedule_maintenance.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchScheduleMaintenance" placeholder="Nombre del cronograma"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                    <th>Ejecutado</th>
                                    <th>Usuario creó</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="scheduleMaintenance in scheduleMaintenances.data" :key="scheduleMaintenance.id">
                                        <td>{{ scheduleMaintenance.name }}</td>
                                        <td>
                                            <span :class="{ badge: true, 'badge-success': !scheduleMaintenance.finished, 'badge-secondary': scheduleMaintenance.finished  }">
                                                {{ scheduleMaintenance.finished ? 'Finalizado' : 'Activo' }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="progress">
                                                <div :class="{ 'progress-bar': true, 
                                                                'progress-bar-striped': !scheduleMaintenance.finished, 
                                                                'progress-bar-animated': !scheduleMaintenance.finished,
                                                                'bg-success': percentageMade(scheduleMaintenance) == 100
                                                            }" 
                                                    role="progressbar" aria-valuemin="0" aria-valuemax="100" :style="`width: ${ percentageMade(scheduleMaintenance) }%`">
                                                    {{ percentageMade(scheduleMaintenance) }}%
                                                </div>
                                            </div>
                                        </td>
                                        <td>{{ scheduleMaintenance.user.names }}</td>
                                        <th nowrap>
                                            <button class="btn btn-secondary btn-sm" :disabled="!hasPermission('schedule-maintenance.show')" style="margin-right:3px"
                                                @click="$router.push({ name: 'schedule_maintenance.show', params: { id: scheduleMaintenance.id } })">
                                                <i class="fa fa-info-circle"></i>
                                            </button>
                                            <button class="btn btn-danger btn-sm mr-1" :disabled="!hasPermission('schedule-maintenance.destroy')"
                                                @click="deleteScheduleMaintenance(scheduleMaintenance.id)" title="Eliminar">
                                                <i class="fa fa-trash-alt"></i>
                                            </button>
                                            <button class="btn btn-success btn-sm" :disabled="!hasPermission('schedule-maintenance.finalize')"
                                                v-if="!scheduleMaintenance.finished"
                                                @click="finishScheduleMaintenance(scheduleMaintenance.id)">
                                                <i class="fa fa-calendar-check"></i> Finalizar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="scheduleMaintenances" @pagination-change-page="getScheduleMaintenances"></pagination>
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
        name: 'scheduleMaintenances.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getScheduleMaintenances()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                scheduleMaintenances: {},
                loading: true
            }
        },
        methods: {
            searchScheduleMaintenance (search) {
                this.loading = true
                this.getScheduleMaintenances(1, search.search)
            },
            getScheduleMaintenances (page = 1, search = '') {
                this.$http.get(`schedule-maintenances?page=${ page }&name=${ search }`).then( response => {
                    this.scheduleMaintenances = response.data
                    this.loading = false
                })
            },
            deleteScheduleMaintenance (scheduleMaintenance) {
                this.$http.delete(`schedule-maintenances/${ scheduleMaintenance }`).then( response => {
                    this.getScheduleMaintenances()
                    this.$toastr.success('Cronograma eliminado')
                }).catch(error => {
                    if (error.response.status == 422) {
                        this.$toastr.error(error.response.data.errors.message)
                    }
                })
            },
            finishScheduleMaintenance (scheduleMaintenance) {
                this.$http.delete(`schedule-maintenances/${ scheduleMaintenance }/finish`).then( response => {
                    this.getScheduleMaintenances()
                    this.$toastr.success('Cronograma finalizado')
                }).catch(error => {
                    if (error.response.status == 422) {
                        this.$toastr.error(error.response.data.errors.message)
                    }
                })
            },
            percentageMade(scheduleMaintenances) {
                let total = scheduleMaintenances.schedule_maintenance_details.length

                let made = scheduleMaintenances.schedule_maintenance_details.filter(detail => {
                    return detail.made == true
                }).length

                let percentage = (made * 100)/total
                return Math.floor(percentage)
            }
        }
    }
</script>