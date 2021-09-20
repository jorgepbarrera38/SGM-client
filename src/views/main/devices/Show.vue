<template>
    <div class="container">
        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading> 
        <div class="row" v-else>
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-header">
                        <span class="panel-title">
                            Foto
                        </span>
                        <div class=" float-right">
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label class="btn btn-secondary btn-sm" @click="$router.back()">
                                    <input type="radio" name="options" id="option2" autocomplete="off"> <i class="fa fa-undo"></i> Atrás
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <img class="img-fluid" :src="`${ $serverFiles }/${device.photoPrincipal.photo}`" alt="" v-if="device.photoPrincipal">
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <span class="panel-title">
                            Registro fotográfico
                        </span>
                        <div class=" float-right">
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label v-if="device.active" :class="{'btn btn-warning': true, 'btn-sm': true, disabled: !hasPermission('devices.edit') }" 
                                    @click="hasPermission('devices.edit') ? $router.push({ name: 'devices.photographicRecordUpdate' }) : ''">
                                    <input type="radio" name="options" id="option3" autocomplete="off"> <i class="fa fa-edit"></i> Editar
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="app">
                            <img class="image" v-for="(image, i) in device.photographic_records" :src="image" :key="i" @click="index = i" width="60" style="cursor:pointer">
                            <vue-gallery-slideshow :images="device.photographic_records" :index="index" @close="index = null"></vue-gallery-slideshow>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Información
                        </span>
                        <div class="float-right" v-if="device.active">
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label :class="{ btn: true, 'btn-warning': true, 'btn-sm': true, disabled: !hasPermission('devices.edit') }"
                                    @click="hasPermission('devices.edit') ? $router.push({ name: 'devices.edit', params: { id: device.id } }) : ''">
                                    <input type="radio" name="options" id="option2" autocomplete="off"> <i class="fa fa-edit"></i> Editar
                                </label>
                                <label :class="{ btn: true, 'btn-danger': true, 'btn-sm': true, disabled: !hasPermission('devices.down') }" 
                                    @click="hasPermission('devices.down') ? $router.push({ name: 'devices.down.create' }) : ''">
                                    <input type="radio" name="options" id="option3" autocomplete="off"> <i class="fa fa-trash-alt"></i> Dar de baja
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <strong>Grupo:</strong> {{ device.group.name }} <br>
                        <strong>Elemento:</strong> {{ device.element.name }} <br>
                        <strong>Ubicación:</strong> {{ device.location.name }} <br>
                        <strong>Dependencia:</strong> {{ device.dependence.name }} <br>
                        <strong>Responsable:</strong> {{ device.responsible.fullnames }} <br> <br>

                        <strong>Placa:</strong> {{ device.internal_code }} 
                                <template v-if="device.active">
                                    <button v-if="!showFormForUpdateInternalCode" class="btn btn-success btn-sm" :disabled="!hasPermission('devices.update-internal-code')"
                                        title="Actualizar"
                                        @click="showFormForUpdateInternalCode = true">
                                        <i class="fa fa-sync-alt"></i>
                                    </button>
                                    <form @submit.prevent="updateInternalCode" class="mt-2" v-else>
                                        <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                            <li v-for="(error, index) in errors" :key="`error-${ index }`">{{ error[0] }}</li>
                                        </div>
                                        <div class="form-group">
                                            <input type="text" class="form-control" placeholder="Nueva placa" v-model="newInternalCode" maxlength="20">
                                        </div>
                                        <vue-loading v-if="updatingInternalCode" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading> 
                                        <div v-else>
                                            <button type="submit" class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                            <a href="#" class="btn btn-danger btn-sm" @click.prevent="showFormForUpdateInternalCode = false; newInternalCode = ''; errors = null"><i class="fa fa-times-circle"></i> Cancelar</a>
                                        </div>
                                    </form>
                                </template>
                        <br>
                        <strong>Serial:</strong> {{ device.serial_number }} <br>
                        <strong>Marca:</strong> {{ device.brand.name }} <br>
                        <strong>Modelo:</strong> {{ device.model }} <br> <br>
                        <strong>Descripción:</strong> <div class="text-justify">{{ device.description }}</div> <br> <br>
                        <strong>Observaciónes:</strong> <div class="text-justify">{{ device.observations }}</div> <br> <br>

                        <strong>Inicio de operación:</strong> {{ convertDate(device.start_operation) }} <br>
                        <strong>Fecha fin de garantía:</strong> {{ convertDate(device.date_end_guarantee) }} <br>
                        <strong>Vida útil:</strong> {{ device.useful_life }} {{ device.useful_life == 1 ? 'año' : 'años' }}<br>
                        
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card" v-if="!device.active">
                    <div class="card-header">
                        <span class="panel-title">
                            Información de baja
                        </span>
                    </div>
                    <div class="card-body">
                        <strong>Fecha:</strong> {{ device.down_date }} <br>
                        <strong>Motivo:</strong> {{ device.down_reason }} <br>
                        <a href="#" 
                            @click.prevent="showEvidence(device.down_evidence)"
                            class="btn btn-primary btn-sm" target="_blank">
                            <i class="fa fa-file-alt"></i> Evidencia
                        </a>
                    </div>
                </div>
                <div class="card" :style="device.active ? '' : 'margin-top:20px'">
                    <div class="card-header">
                        <span class="panel-title">
                            Mantenimientos programados
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive limit-table">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Cronograma</th>
                                    <th>Estado cronograma</th>
                                </thead>
                                <tbody>
                                    <tr v-for="scheduleMaintenanceDetail in device.schedule_maintenance_details" :key="`schedule-detail-${ scheduleMaintenanceDetail.id }`">
                                        <td nowrap>{{ convertDateSchedule(scheduleMaintenanceDetail.date) }}</td>
                                        <td>
                                            <div :class="{ badge: true, 'badge-success': scheduleMaintenanceDetail.made, 'badge-danger': !scheduleMaintenanceDetail.made }">
                                                {{ scheduleMaintenanceDetail.made ? 'Realizado' : 'Pendiente' }}
                                            </div>
                                        </td>
                                        <td nowrap>{{ scheduleMaintenanceDetail.schedule_maintenance.name }}</td>
                                        <td>
                                            <span :class="{ 
                                                            badge: true, 'badge-success': !scheduleMaintenanceDetail.schedule_maintenance.finished, 
                                                            'badge-secondary': scheduleMaintenanceDetail.schedule_maintenance.finished  }">
                                                {{ scheduleMaintenanceDetail.schedule_maintenance.finished ? 'Finalizado' : 'Activo' }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="card" style="margin-top:20px">
                    <div class="card-header">
                        <span class="panel-title">
                            Trazabilidad del dispositivo
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('devices.movements.create')" v-if="device.active"
                            @click="$router.push({ name: 'devices.movements.create', params: { id: device.id } })">
                            <i class="fa fa-plus"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive limit-table">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Fecha</th>
                                    <th>Ubicación</th>
                                    <th>Dependencia</th>
                                    <th>Responsable</th>
                                    <th>Usuario</th>
                                </thead>
                                <tbody>
                                    <tr v-for="movement in device.movements" :key="`movement-${ movement.id }`" :title="movement.observations">
                                        <td nowrap>{{ convertDate(movement.created_at) }}</td>
                                        <td nowrap>{{ movement.location.name }}</td>
                                        <td nowrap>{{ movement.dependence.name }}</td>
                                        <td nowrap>{{ movement.responsible.fullnames }}</td>
                                        <td nowrap>{{ movement.user.names }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="card" style="margin-top:20px">
                    <div class="card-header">
                        <span class="panel-title">
                            Mantenimientos preventivos
                        </span>
                        <button class="btn btn-success btn-sm float-right" v-if="device.active" :disabled="!hasPermission('preventive-maintenances.create')"
                                @click="$router.push({ name: 'devices.preventive_maintenances.create', params: { id: device.id } })">
                                <i class="fa fa-plus"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive limit-table">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Fecha</th>
                                    <th>Técnico</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="preventiveMaintenance in device.preventive_maintenances" :key="`preventive-${ preventiveMaintenance.id }`">
                                        <td nowrap>{{ convertDate(preventiveMaintenance.date_of_realization) }}</td>
                                        <td nowrap>{{ preventiveMaintenance.user.names }}</td>
                                        <td nowrap>
                                                <button class="btn btn-secondary btn-sm pl-3 pr-3 mr-1" title="Información" 
                                                    @click="showReplacements(preventiveMaintenance.replacement_maintenancables)">
                                                    <i class="fa fa-info"></i>
                                                </button>
                                                <a href="#" class="btn btn-primary btn-sm mr-1" title="Evidencia" 
                                                    @click.prevent="showEvidence(preventiveMaintenance.evidence)">
                                                    <i class="fa fa-eye"></i>
                                                </a>
                                                <button class="btn btn-warning btn-sm mr-1" title="Editar" v-if="device.active" :disabled="!hasPermission('preventive-maintenances.edit')"
                                                    @click="$router.push({ name: 'devices.preventive_maintenances.edit', params: { idPreventiveMaintenance: preventiveMaintenance.id } })">
                                                    <i class="fa fa-edit"></i>
                                                </button>
                                                <button class="btn btn-danger btn-sm" title="Eliminar" :disabled="!hasPermission('preventive-maintenances.destroy')"
                                                    v-if="device.active" @click="deletePreventiveMaintenance(preventiveMaintenance.id)">
                                                    <i class="fa fa-trash-alt"></i>
                                                </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="card" style="margin-top:20px"> 
                    <div class="card-header">
                        <span class="panel-title">
                            Otros mantenimientos
                        </span>
                        <button class="btn btn-success btn-sm float-right" v-if="device.active" :disabled="!hasPermission('other-maintenances.create')"
                                @click="$router.push({ name: 'devices.other_maintenances.create', params: { id: device.id } })">
                                <i class="fa fa-plus"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive limit-table">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Fecha</th>
                                    <th>Clasificación</th>
                                    <th>Técnico</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="other_maintenance in device.other_maintenances" :key="`other-maint-${ other_maintenance.id }`">
                                        <td nowrap>{{ convertDate(other_maintenance.date_of_realization) }}</td>
                                        <td nowrap>{{ other_maintenance.type_other_maintenance.name }}</td>
                                        <td nowrap>{{ other_maintenance.user.names }}</td>
                                        <td nowrap>
                                            <div class="float-right">
                                                <button class="btn btn-secondary btn-sm pl-3 pr-3 mr-1" title="Información" 
                                                    @click="showReplacements(other_maintenance.replacement_maintenancables, other_maintenance.reason, other_maintenance.conclusion)">
                                                    <i class="fa fa-info"></i>
                                                </button>
                                                <button class="btn btn-primary btn-sm mr-1" title="Evidencia" 
                                                    @click="showEvidence(other_maintenance.evidence)">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                                <button class="btn btn-warning btn-sm mr-1" title="Editar" v-if="device.active" :disabled="!hasPermission('other-maintenances.edit')"
                                                    @click="$router.push({ name: 'devices.other_maintenances.edit', params: { idOtherMaintenance: other_maintenance.id } })">
                                                    <i class="fa fa-edit"></i>
                                                </button>
                                                <button class="btn btn-danger btn-sm" title="Eliminar" v-if="device.active" :disabled="!hasPermission('other-maintenances.destroy')"
                                                    @click="deleteOtherMaintenance(other_maintenance.id)">
                                                    <i class="fa fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- Modal replacenets -->
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Información</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group" v-if="reason">
                                <strong>Motivo</strong>
                                <p class="text-justify">{{ reason }}</p>
                            </div>
                            <div class="form-group" v-if="conclusion">
                                <strong>Conclusión</strong>
                                <p class="text-justify">{{ conclusion }}</p>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Repuesto</th>
                                        <th>Cantidad</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="replacement in replacements" :key="`replacement-from-other-maintenance-${ replacement.id }`">
                                            <td>{{ replacement.replacement.name }}</td>
                                            <td>{{ replacement.quantity }}</td>
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
                <div class="card" style="margin-top:20px"> 
                    <div class="card-header">
                        <span class="panel-title">
                            Documentos
                        </span>
                        <button class="btn btn-success btn-sm float-right" v-if="device.active" :disabled="!hasPermission('document.create')"
                                @click="$router.push({ name: 'devices.documents.create', params: { id: device.id } })">
                                <i class="fa fa-plus"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive limit-table">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Documento</th>
                                    <th>Usuario</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="document in device.documents" :key="`document-${ document.id }`">
                                        <td nowrap>{{ document.type_document.name }}</td>
                                        <td nowrap>{{ document.user.names }}</td>
                                        <td nowrap>
                                            <div class="float-right">
                                                <button class="btn btn-primary btn-sm mr-1" title="Evidencia" 
                                                    @click="showEvidence(document.file)">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                                <button class="btn btn-danger btn-sm" title="Eliminar" v-if="device.active" :disabled="!hasPermission('document.destroy')"
                                                    @click="deleteDocument(document.id)">
                                                    <i class="fa fa-trash-alt"></i>
                                                </button>
                                            </div>
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
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import ModalFullHeight from '../components/ModalFullHeight'
    import VueGallerySlideshow from 'vue-gallery-slideshow';

    export default {
        name: 'devices.show',
        components: {
            VueLoading, 'modal-full-height': ModalFullHeight, VueGallerySlideshow
        },
        created () {
            this.getDevice()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                device: {
                    id: 0,
                    element: {
                        name: ''
                    },
                    location: {
                        name: ''
                    },
                    dependence: {
                        name: ''
                    },
                    responsible: {
                        fullnames: ''
                    },
                    brand: {
                        name: ''
                    },
                    movements: [],
                    preventive_maintenances: [],
                    other_maintenances: [],
                    photographic_records: [],
                    schedule_maintenance_details: []
                },
                replacements: [],
                reason: '',
                conclusion: '',
                evidence: '',
                showFormForUpdateInternalCode: false,
                newInternalCode: '',
                updatingInternalCode: false,
                loading: true,
                errors: {},
                index: null,
            }
        },
        methods: {
            getDevice () {
                this.$http.get(`devices/${ this.$route.params.id }`).then( response => {
                    this.device = response.data
                    this.device.photoPrincipal = this.device.photographic_records.find( photographic_record => photographic_record.principal)
                    this.device.photographic_records = this.device.photographic_records.map( photographic_record => `${ this.$serverFiles }/${photographic_record.photo}`)
                    this.loading = false
                }).catch( error => {
                    if (error.response.status == 422) {
                        this.$toastr.error(error.response.data.errors.message[0])
                        this.$router.push({ name: 'devices.index' })
                    }
                })
            },
            deletePreventiveMaintenance (preventiveMaintenance) {
                this.$http.delete(`preventive-maintenances/${ preventiveMaintenance }`).then( response => {
                    this.$toastr.success('Registro eliminado exitosamente')
                    this.getDevice()
                }).catch( error => {
                    if (error.response.status == 403) {
                        this.$toastr.error('Solo puede eliminar sus propios registros')
                    }
                    if (error.response.status == 404) {
                        this.$toastr.error('El registro no existe o ya fue eliminado')
                    }
                })
            },
            deleteOtherMaintenance (otherMaintenance) {
                this.$http.delete(`other-maintenances/${ otherMaintenance }`).then( response => {
                    this.$toastr.success('Registro eliminado exitosamente')
                    this.getDevice()
                }).catch( error => {
                    if (error.response.status == 403) {
                        this.$toastr.error('Solo puede eliminar sus propios registros')
                    }
                    if (error.response.status == 404) {
                        this.$toastr.error('El registro no existe o ya fue eliminado')
                    }
                })
            },
            showReplacements (replacements, reason, conclusion) {
                this.replacements = replacements
                this.reason = reason
                this.conclusion = conclusion
                $('#exampleModal').modal('show')
            },
            showEvidence (evidence) {
                this.evidence = `${this.$serverFiles}/${ evidence }`
                $('#modalFullHeight').modal('show')
            },
            updateInternalCode () {
                this.updatingInternalCode = true
                if (!this.newInternalCode) {
                    this.updatingInternalCode = false
                    return this.$toastr.error('Ingrese la nueva placa')
                }
                
                this.$http.put(`devices/${ this.$route.params.id }/update-internal-code`, { internal_code: this.newInternalCode }).then( response => {
                    this.device.internal_code = this.newInternalCode
                    this.showFormForUpdateInternalCode = false
                    this.$toastr.success('Placa actualizada')
                    this.errors = {}
                    this.newInternalCode = ''
                    this.updatingInternalCode = false
                }).catch(errors => {
                    if (errors.response.status == 422 ){
                        this.errors = errors.response.data.errors
                    }
                    this.updatingInternalCode = false
                })
            },
            convertDate (date) {
                return this.$moment(date).format('DD[-]MMMM[-]Y')
            },
            convertDateSchedule (date) {
                return this.$moment(date).format('Y[-]MMMM')
            },
            deleteDocument (document) {
                this.$http.delete(`documents/${ document }`).then( response => {
                    this.$toastr.success('Documento eliminado')
                    this.getDevice()
                }).catch( error => {
                    if (error.response.status == 403) {
                        this.$toastr.error('Solo puede eliminar sus propios registros')
                    }
                    if (error.response.status == 404) {
                        this.$toastr.error('El registro no existe o ya fue eliminado')
                    }
                })
            }
        },
        computed: {
            photoPrincipal () {          
                return this.device.photographic_records
            }
        },
    }
</script>
