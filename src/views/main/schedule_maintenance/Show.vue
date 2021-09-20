<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            {{ scheduleMaintenance.name }}
                        </span>
                        <div class="float-right">
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label class="btn btn-secondary btn-sm" @click="$router.push({ name: 'schedule_maintenance.index' })" title="Atrás">
                                    <input type="radio" name="options" id="option1" autocomplete="off">
                                    <i class="fa fa-undo"></i> 
                                </label>
                                <label class="btn btn-success btn-sm" @click="updating = true; getscheduleMaintenance()" title="Actualizar">
                                    <input type="radio" name="options" id="option2" autocomplete="off">
                                    <div class="spinner-border spinner-border-sm" role="status" v-if="updating">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                    <i class="fa fa-sync-alt" v-else></i>
                                </label>
                                <label class="btn btn-primary btn-sm" @click="showModalRecordDelScheduleMaintenances" title="Dispositivos eliminados">
                                    <input type="radio" name="options" id="option1" autocomplete="off">
                                    <i class="fa fa-file-archive"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <strong>Programados:</strong> {{ scheduleMaintenance.schedule_maintenance_details.length }} -
                        <strong>Realizados:</strong> {{ quantityScheduleMaintenanceDetailsMade }} -
                        <strong>Pendientes:</strong> {{ quantityScheduleMaintenanceDetailsPending }} -
                        <strong>Ejecutado:</strong> {{ isNaN(percentageMade) ? 0 : percentageMade }}%

                        <button class="btn btn-success btn-sm float-right" @click="exportReportExcel" title="Exportar cronograma de mantenimiento">
                            <div class="spinner-border spinner-border-sm" role="status" v-if="downloadingExcel">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <i class="fa fa-file-excel" v-else></i>
                            Exportar
                        </button>
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div v-else style="margin-top:25px">
                            <div class="form-row">
                                <div class="form-group col-md-3">
                                    <label for="">Placa o serial</label>
                                    <input type="text" class="form-control" placeholder="Buscar placa o serial" v-model="search">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="">Estado</label>
                                    <select class="form-control" v-model="made">
                                        <option value="2">Todos</option>
                                        <option value="0">Pendientes</option>
                                        <option value="1">Realizados</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="">Mes</label>
                                    <select class="form-control" v-model="month">
                                        <option value="">Todos</option>
                                        <option :value="`${ scheduleMaintenance.year }-01`">Enero</option>
                                        <option :value="`${ scheduleMaintenance.year }-02`">Febrero</option>
                                        <option :value="`${ scheduleMaintenance.year }-03`">Marzo</option>
                                        <option :value="`${ scheduleMaintenance.year }-04`">Abril</option>
                                        <option :value="`${ scheduleMaintenance.year }-05`">Mayo</option>
                                        <option :value="`${ scheduleMaintenance.year }-06`">Junio</option>
                                        <option :value="`${ scheduleMaintenance.year }-07`">Julio</option>
                                        <option :value="`${ scheduleMaintenance.year }-08`">Agosto</option>
                                        <option :value="`${ scheduleMaintenance.year }-09`">Septiembre</option>
                                        <option :value="`${ scheduleMaintenance.year }-10`">Octubre</option>
                                        <option :value="`${ scheduleMaintenance.year }-11`">Noviembre</option>
                                        <option :value="`${ scheduleMaintenance.year }-12`">Diciembre</option>
                                    </select>
                                </div>
                            </div>
                            <div class="table-responsive limit-table-size">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Grupo</th>
                                        <th>Elemento</th>
                                        <th>H.V</th>
                                        <th>Placa</th>
                                        <th>Serie</th>
                                        <th>Ubicación</th>
                                        <th>Dependencia</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="scheduleMaintenanceDetail in scheduleMaintenanceDetailFltered" :key="scheduleMaintenanceDetail.id">
                                            <td nowrap>{{ scheduleMaintenanceDetail.device.group.name }}</td>
                                            <td nowrap>{{ scheduleMaintenanceDetail.device.element.name }}</td>
                                            <td>{{ scheduleMaintenanceDetail.device.id }}</td>
                                            <td>{{ scheduleMaintenanceDetail.device.internal_code }}</td>
                                            <td nowrap>{{ scheduleMaintenanceDetail.device.serial_number }}</td>
                                            <td nowrap>{{ scheduleMaintenanceDetail.device.location.name }}</td>
                                            <td>{{ scheduleMaintenanceDetail.device.dependence.name }}</td>
                                            <td>
                                                <span v-if="!scheduleMaintenanceDetail.editDateToReprogram">{{ convertDate(scheduleMaintenanceDetail.date) }}</span>
                                                <form @submit.prevent="reschedule(scheduleMaintenanceDetail.id, scheduleMaintenanceDetail.newDateReprogrammer)" v-else>
                                                    <div class="form-group">
                                                        <select class="form-control"
                                                            v-model="scheduleMaintenanceDetail.newDateReprogrammer">
                                                            <option value=""></option>
                                                            <option :value="month.date" v-for="(month, index) in months" :key="`month-${ index }`">
                                                                {{ month.name }}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <button type="submit" class="btn btn-primary btn-sm mr-1" title="Guardar">
                                                        <i class="fa fa-save"></i>
                                                    </button>
                                                    <a href="" class="btn btn-danger btn-sm" 
                                                        @click.prevent="scheduleMaintenanceDetail.editDateToReprogram = false; scheduleMaintenanceDetail.newDateReprogrammer = ''"
                                                        title="Cancelar">
                                                        <i class="fa fa-times-circle"></i>
                                                    </a>
                                                </form>
                                            </td>
                                            <td>
                                                <div :class="{ badge: true, 'badge-success': scheduleMaintenanceDetail.made, 'badge-danger': !scheduleMaintenanceDetail.made }">
                                                    {{ scheduleMaintenanceDetail.made ? 'Realizado' : 'Pendiente' }}
                                                </div>
                                            </td>
                                            <td nowrap>
                                                <button class="btn btn-secondary btn-sm mr-1" title="Reprogramar" :disabled="!hasPermission('schedule-maintenance.reschedule-devices')"
                                                    v-if="!scheduleMaintenanceDetail.editDateToReprogram && !scheduleMaintenanceDetail.made"
                                                    @click="showSelectToReprogramDate(scheduleMaintenanceDetail)">
                                                    <i class="fa fa-clock"></i>
                                                </button>
                                                <button class="btn btn-danger btn-sm mr-1" title="Eliminar elemento del cronograma" :disabled="!hasPermission('schedule-maintenance.delete-devices')"
                                                    @click="showModalDeleteScheduleMaintenanceDetail(scheduleMaintenanceDetail.id)">
                                                    <i class="fa fa-trash-alt"></i>
                                                </button>
                                                <button class="btn btn-info btn-sm mr-1" title="Histórico de programación"
                                                    v-if="scheduleMaintenanceDetail.record_schedule_maintenances.length"
                                                    @click="showRecordScheduleMaintenances(scheduleMaintenanceDetail.record_schedule_maintenances)">
                                                    <i class="fa fa-calendar-alt"></i>
                                                </button>
                                                <button class="btn btn-primary btn-sm" title="Evidencia" 
                                                    v-if="scheduleMaintenanceDetail.preventive_maintenance"
                                                    @click="showEvidence(scheduleMaintenanceDetail.preventive_maintenance.evidence)">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <!-- Modal replacenets -->
                        <div class="modal fade" id="modalRecordScheduleMaintenances" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Histórico de programación</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover table-sm">
                                            <thead>
                                                <th nowrap>Fecha anterior</th>
                                                <th nowrap>Nueva fecha</th>
                                                <th nowrap>Usuario</th>
                                                <th nowrap>Fecha realización</th>
                                            </thead>
                                            <tbody>
                                                <tr v-for="record_schedule_maintenance in record_schedule_maintenances" :key="`record_schedule_maintenance-${ record_schedule_maintenance.id }`">
                                                    <td>{{ convertDate(record_schedule_maintenance.old_date) }}</td>
                                                    <td>{{ convertDate(record_schedule_maintenance.new_date) }}</td>
                                                    <td>{{ record_schedule_maintenance.user.names }}</td>
                                                    <td>{{ convertDateHuman(record_schedule_maintenance.created_at) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                </div>
                                </div>
                            </div>
                        </div>
                        <!-- Modal observation delete -->
                        <div class="modal fade" id="modalDeleteScheduleDetail" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Observación</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="alert alert-danger" v-show="Object.keys(errorsFromDeleteDetail).length > 0 ? true : false">
                                        <li v-for="(error, index) in errorsFromDeleteDetail" :key="index">
                                            {{ error[0] }}
                                        </li>
                                    </div> 
                                    <div class="form-group">
                                        <textarea rows="4" class="form-control" v-model="observationDeleteScheduleDetail" maxlength="200"></textarea>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <vue-loading v-if="deletingScheduleDetail" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                                    <div v-else>
                                        <button class="btn btn-primary btn-sm mr-1" @click="deleteScheduleMaintenanceDetail">
                                            <i class="fa fa-check-circle"></i> Aceptar
                                        </button>
                                        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                                            <i class="fa fa-undo"></i> Cancelar
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <!-- Modal showRecordDelScheduleMaintenances delete -->
                        <div class="modal fade" id="modalRecordDelScheduleMaintenances" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Dispositivos eliminados</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover table-sm">
                                            <thead>
                                                <th>Fecha</th>
                                                <th>H.V</th>
                                                <th>Placa</th>
                                                <th>Serie</th>
                                                <th>Usuario</th>
                                            </thead>
                                            <tbody>
                                                <tr v-for="record_del_schedule_maintenance in scheduleMaintenance.record_del_schedule_maintenances" 
                                                    :key="`record_del_schedule_maintenance-${ record_del_schedule_maintenance.id }`"
                                                    :title="record_del_schedule_maintenance.observation">

                                                    <td>{{ convertDateHuman(record_del_schedule_maintenance.created_at) }}</td>
                                                    <td>{{ record_del_schedule_maintenance.device.id }}</td>
                                                    <td>{{ record_del_schedule_maintenance.device.internal_code }}</td>
                                                    <td>{{ record_del_schedule_maintenance.device.serial_number }}</td>
                                                    <td>{{ record_del_schedule_maintenance.user.names }}</td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                </div>
                                </div>
                            </div>
                        </div>
                        <!-- Modal evidence -->
                        <modal-full-height :evidence="evidence" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import ModalFullHeight from '../components/ModalFullHeight'
    import download from 'downloadjs'
    export default {
        name: 'scheduleMaintenances.index',
        components: {
            VueLoading, 'modal-full-height': ModalFullHeight
        },
        created () {
            this.getscheduleMaintenance()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                scheduleMaintenance: {
                    name: '',
                    year: '',
                    schedule_maintenance_details: [],
                    record_del_schedule_maintenances: []
                },
                evidence: '',
                loading: true,
                downloadingExcel: false,
                months: [],
                record_schedule_maintenances: [],
                updating: false,
                search: '',
                made: 2,
                month: '',
                scheduleDetailIdToDelete: '',
                observationDeleteScheduleDetail: '',
                errorsFromDeleteDetail: {},
                deletingScheduleDetail: false
            }
        },
        methods: {
            getscheduleMaintenance () {
                this.$http.get(`schedule-maintenances/${ this.$route.params.id }`).then( response => {
                    this.scheduleMaintenance = response.data
                    this.scheduleMaintenance.schedule_maintenance_details.forEach(schedule_maintenance_detail => {
                        this.$set(schedule_maintenance_detail, 'editDateToReprogram', false)
                        this.$set(schedule_maintenance_detail, 'newDateReprogrammer', '')
                    })
                    this.setMonths()
                    this.loading = false
                    this.updating = false
                })
            },
            convertDate (date) {
                return this.$moment(date).format('Y[-]MMMM')
            },
            convertDateHuman (date) {
                return this.$moment(date).format('DD[-]MMMM[-]Y')
            },
            showEvidence (evidence) {
                this.evidence = `${this.$serverFiles}/${ evidence }`
                $('#modalFullHeight').modal('show')
            },
            exportReportExcel () {
                this.downloadingExcel = true
                 this.$http.get(`schedule-maintenances/${ this.$route.params.id }/export-excel`, { responseType: 'blob' }).then( response => {
                    this.downloadingExcel = false
                    download(response.data, "Cronograma-de-mantenimiento.xlsx", "blob");
                }).catch(error => {
                    this.downloadingExcel = false
                    this.$toastr.error('Error al descargar el reporte')
                })
            },
            setMonths () {
                this.months = [
                    { name: 'Enero', date: `${this.scheduleMaintenance.year}-01-01` },
                    { name: 'Febrero', date: `${this.scheduleMaintenance.year}-02-01` },
                    { name: 'Marzo', date: `${this.scheduleMaintenance.year}-03-01` },
                    { name: 'Abril', date: `${this.scheduleMaintenance.year}-04-01` },
                    { name: 'Mayo', date: `${this.scheduleMaintenance.year}-05-01` },
                    { name: 'Junio', date: `${this.scheduleMaintenance.year}-06-01` },
                    { name: 'Julio', date: `${this.scheduleMaintenance.year}-07-01` },
                    { name: 'Agosto', date: `${this.scheduleMaintenance.year}-08-01` },
                    { name: 'Septiembre', date: `${this.scheduleMaintenance.year}-09-01` },
                    { name: 'Octubre', date: `${this.scheduleMaintenance.year}-10-01` },
                    { name: 'Noviembre', date: `${this.scheduleMaintenance.year}-11-01` },
                    { name: 'Diciembre', date: `${this.scheduleMaintenance.year}-12-01` }
                ]
            },
            showSelectToReprogramDate (scheduleMaintenanceDetail) {
                scheduleMaintenanceDetail.editDateToReprogram = true
            },
            reschedule (IdScheduleMaintenanceDetail, newDateScheduleMaintenanceDetail) {
                this.$http.put(`schedule-maintenances/${ IdScheduleMaintenanceDetail }/reschedule-detail`, { newDateScheduleMaintenanceDetail } ).then( response => {
                    this.getscheduleMaintenance()
                    this.$toastr.success('Elemento reprogramado')
                }).catch(error => {
                    if (error.response.status == 422) {
                        if (error.response.data.errors.message) {
                            this.$toastr.error(error.response.data.errors.message[0])
                        } else {
                            this.$toastr.error(error.response.data.errors.newDateScheduleMaintenanceDetail[0])
                        }
                    }
                })
            },
            showRecordScheduleMaintenances (recordScheduleMaintenances) {
                this.record_schedule_maintenances = recordScheduleMaintenances
                $('#modalRecordScheduleMaintenances').modal('show')
            },
            deleteScheduleMaintenanceDetail () {
                this.deletingScheduleDetail = true
                this.$http.post(`schedule-maintenances/${ this.scheduleDetailIdToDelete }/delete-detail`, { observation : this.observationDeleteScheduleDetail }).then( response => {
                    this.getscheduleMaintenance()
                    $('#modalDeleteScheduleDetail').modal('hide')
                    this.$toastr.success('Elemento eliminado del cronograma')
                    this.observationDeleteScheduleDetail = ''
                    this.scheduleDetailIdToDelete = ''
                    this.deletingScheduleDetail = false
                    this.errorsFromDeleteDetail = {}
                }).catch(error => {
                    this.deletingScheduleDetail = false
                    if (error.response.status == 422) {
                        this.errorsFromDeleteDetail = error.response.data.errors
                    }
                })
            },
            showModalDeleteScheduleMaintenanceDetail (scheduleMaintenanceDetailId) {
                this.scheduleDetailIdToDelete = scheduleMaintenanceDetailId
                $('#modalDeleteScheduleDetail').modal('show')
            },
            showModalRecordDelScheduleMaintenances () {
                $('#modalRecordDelScheduleMaintenances').modal('show')
            }
        },
        computed: {
            quantityScheduleMaintenanceDetailsMade () {
                return this.scheduleMaintenance.schedule_maintenance_details.filter(schedule_maintenance_detail => {
                    return schedule_maintenance_detail.made
                }).length
            },
            quantityScheduleMaintenanceDetailsPending () {
                return this.scheduleMaintenance.schedule_maintenance_details.filter(schedule_maintenance_detail => {
                    return !schedule_maintenance_detail.made
                }).length
            },
            percentageMade() {
                let total = this.scheduleMaintenance.schedule_maintenance_details.length

                let made = this.scheduleMaintenance.schedule_maintenance_details.filter(detail => {
                    return detail.made == true
                }).length

                let percentage = (made * 100)/total
                return percentage
            },
            scheduleMaintenanceDetailFltered () {
                return this.scheduleMaintenance.schedule_maintenance_details.filter(schedule_maintenance_detail => {
                    return (
                            schedule_maintenance_detail.device.serial_number.includes(this.search)
                            || schedule_maintenance_detail.device.internal_code.includes(this.search)
                            )
                            && (this.made == '2' ? schedule_maintenance_detail : schedule_maintenance_detail.made == this.made)
                            && schedule_maintenance_detail.date.includes(this.month)
                })

                //
            }
        },
    }
</script>
<style scoped>
.limit-table-size {
    max-height:400px;
    overflow:auto;
}
</style>