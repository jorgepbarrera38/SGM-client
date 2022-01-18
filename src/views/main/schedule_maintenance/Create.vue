<template>
    <div class="container-fluid">
        <div class="row mb-3">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Registrar cronograma de mantenimiento
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="showFormsForStartSchedule">
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                    <li v-for="(error, index) in errors" :key="index">
                                        {{ error[0] }}
                                    </li>
                                </div>   
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="">Nombre</label>
                                    <input type="text" class="form-control" maxlength="60" v-model="nameOfSchedule" :disabled="showFormsForSchedule" required>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="">Año</label>
                                    <input type="number" class="form-control" maxlength="60" v-model="yearOfSchedule" :disabled="showFormsForSchedule" required min="2021" max="2100">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-sm mr-1" v-if="!showFormsForSchedule">
                                <i class="fa fa-check-circle"></i> Aceptar
                            </button>
                            <a href="" class="btn btn-warning btn-sm mr-1" v-if="showFormsForSchedule" @click.prevent="undoSchedule">
                                <i class="fa fa-undo"></i> Deshacer
                            </a>
                            <router-link class="btn btn-danger btn-sm" :to="{ name: 'schedule_maintenance.index' }"><i class="fa fa-times-circle"></i> Cancelar</router-link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="showFormsForSchedule">
            <div class="col-md-5">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Dispositivos activos
                        </span>
                    </div>
                    <div class="card-body">
                        
                        <div id="accordion">
                            <div class="card" v-for="(item) in dataToCreateScheduleMaintenance" :key="item.id">
                                <div class="card-header" :id="`headingOne-${ item.id }`">
                                <h5 class="mb-0">
                                    <button class="btn btn-link collapsed" data-toggle="collapse" :data-target="`#collapseOne-${ item.id }`" aria-expanded="true" :aria-controls="`collapseOne-${ item.id }`">
                                    {{ item.name + ' (' + item.devices.length + ')' }}
                                    </button>
                                    <div class="float-right">
                                        <button class="btn btn-default btn-sm mr-1" @click="selectAllDevices(item)">Todos</button>
                                        <button class="btn btn-default btn-sm mr-1" @click="unSelectAllDevices(item)">Ninguno</button>
                                        <button class="btn btn-primary btn-sm mr-1" @click="addDevices(item)" :disabled="item.added">
                                            <i class="fa fa-plus-circle"></i> Agregar
                                        </button>
                                        <button class="btn btn-danger btn-sm" @click="deleteDevices(item)" :disabled="!item.added">
                                            <i class="fa fa-trash-alt"></i> Quitar
                                        </button>
                                    </div>
                                </h5>
                                </div>
                                <div :id="`collapseOne-${ item.id }`" class="collapse" :aria-labelledby="`headingOne-${ item.id }`" data-parent="#accordion">
                                <div class="card-body">
                                    <div class="form-group">

                                        <strong>Grupos</strong> <br>
                                        <span v-for="group in groups" :key="`group-${ group.id }`" @click="selectDevicesFromThatGroup(item, group.id)">
                                            <span v-if="thereAreDevicesFromThatGroup(item, group.id)">
                                                <input type="checkbox" :id="`location-${ item.id }-group-${ group.id }`"> {{ group.name }}
                                            </span>
                                        </span>

                                        <br>
                                        <br>

                                        <strong>Elementos</strong> <br>
                                        <span v-for="element in elements" :key="`element-${ element.id }`" @click="selectDevices(item, element.id)">
                                            <span v-if="thereAreDevicesFromThatElement(item, element.id)">
                                                <input type="checkbox" :id="`location-${ item.id }-element-${ element.id }`"> {{ element.name }}
                                            </span>
                                        </span>
                                    

                                    </div>
                                    <div style="max-height:400px;overflow:auto">
                                        <div class="table-responsive">
                                            <table class="table table-sm table-hover">
                                                <thead>
                                                    <th></th>
                                                    <th>Grupo</th>
                                                    <th>Elemento</th>
                                                    <th>H.V</th>
                                                    <th>Placa</th>
                                                    <th>Serial</th>
                                                    <th>Dependencia</th>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="device in item.devices" :key="`device-${ device.id }`">
                                                        <td>
                                                            <input type="checkbox" v-model="device.checked" class="mx-1">
                                                        </td>
                                                        <td>
                                                            {{ device.group.name }}
                                                        </td>
                                                        <td>
                                                            {{ device.element.name }}
                                                        </td>
                                                        <td>
                                                            {{ device.resume_number }}
                                                        </td>
                                                        <td>
                                                            {{ device.internal_code }}
                                                        </td>
                                                        <td>
                                                            {{ device.serial_number }} 
                                                        </td>
                                                        <td>
                                                            {{ device.dependence.name }}
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
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Programación
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <li>Total de dispositivos para programar: <strong>{{ devicesSelected.length }}</strong></li>
                            <li>Dispositivos por mes: 
                                <strong>
                                    <span v-if="devicesForMonth == Infinity">0</span>
                                    <span v-else-if="isNaN(devicesForMonth) ">0</span>
                                    <span v-else>{{ devicesForMonth }}</span>
                                </strong>
                            </li>
                        </div>
                        <div class="form-group">
                            <span v-for="(month, index) in months" :key="`month-${ index }`">
                                <input type="checkbox" v-model="month.state"> {{ month.name }}
                            </span>
                        </div>
                        <div style="max-height:400px;overflow:auto" class="mb-3">
                            <div class="table-responsive">
                                <table class="table table-sm table-hover">
                                    <thead>
                                        <th>Grupo</th>
                                        <th>Elemento</th>
                                        <th>H.V</th>
                                        <th>Placa</th>
                                        <th>Serial</th>
                                        <th>Ubicación</th>
                                        <th>Dependencia</th>
                                        <th>Mes</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(device, index) in devicesSelected" :key="`device-${ device.id }`" :class="{ 'table-danger': deviceIsScheduled(device.id) } ">
                                            <td>
                                                {{ device.group.name }}
                                            </td>
                                            <td>
                                                {{ device.element.name }}
                                            </td>
                                            <td>
                                                {{ device.resume_number }}
                                            </td>
                                            <td nowrap>
                                                {{ device.internal_code }}
                                            </td>
                                            <td nowrap>
                                                {{ device.serial_number }} 
                                            </td>
                                            <td nowrap>
                                                {{ device.location.name }}
                                            </td>
                                            <td nowrap>
                                                {{ device.dependence.name }}
                                            </td>
                                            <td nowrap>
                                                <select name="" id="" class="form-control" v-model="device.month" style="width:130px">
                                                    <option :value="{ name: '', date: '', state: '' }"></option>
                                                    <option :value="month" v-for="month in months" :key="`device-${ device.id }-month-for-select${ month.name }`">
                                                        {{ month.name }}
                                                    </option>
                                                </select>
                                            </td>
                                            <td>
                                                <button class="btn btn-danger btn-sm" @click="deleteDeviceFromDeviceSelected(index)">
                                                    <i class="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="form-group" v-else>
                            <button class="btn btn-primary" @click="save">
                                <i class="fa fa-save"></i> Guardar
                            </button>
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
        name: 'schedule_maintenance.create',
        components: {
            VueLoading
        },
        created () {
            this.getDataToCreateScheduleMaintenance()
        },
        data() {
            return {
                dataToCreateScheduleMaintenance: [],
                nameOfSchedule: '',
                yearOfSchedule: '',
                devicesSelected: [],
                groups: [],
                elements: [],
                months: [],
                devicesForMonth: 0,
                keysFromDeviceThatAreScheduled: [],
                saving: false,
                showFormsForSchedule: false,
                errors: {}
            }
        },
        methods: {
            getDataToCreateScheduleMaintenance () {
                let url = 'schedule-maintenances/get-data-to-create-schedule-maintenance'

                this.$http.get(url).then( response => {
                    this.groups = response.data[0]
                    this.elements = response.data[1]
                    this.dataToCreateScheduleMaintenance = response.data[2]

                    this.dataToCreateScheduleMaintenance.forEach(location => {
                        this.$set(location, 'added', false)
                        location.devices.forEach( device => {
                            this.$set(device, 'checked', false)
                        })
                    })                    
                })
            },
            selectAllDevices (location) {
                //Checkea todos los dispositivos de esa ubicación
                location.devices.forEach(device => {
                    device.checked = true
                })

                //Busca el grupo para checkear y demostrar que todos los dispositivos de ese tipo están checkeados
                this.groups.forEach( group => {
                    let checkGroup = document.getElementById(`location-${ location.id }-group-${ group.id }`)
                    if (checkGroup) {
                        checkGroup.checked = true
                    }
                })

                //Busca el elemento para checkear y demostrar que todos los dispositivos de ese tipo están checkeados
                this.elements.forEach( element => {
                    let checkElement = document.getElementById(`location-${ location.id }-element-${ element.id }`)
                    if (checkElement) {
                        checkElement.checked = true
                    }
                })
            },
            unSelectAllDevices (location) {
                //Des-checkea todos los dispositivos de esa ubicación
                location.devices.forEach(device => {
                    device.checked = false
                })
                //Busca el grupo para des-checkear y demostrar que todos los dispositivos de ese tipo están des-checkeados
                this.groups.forEach( group => {
                    let checkGroup = document.getElementById(`location-${ location.id }-group-${ group.id }`)
                    if (checkGroup) {
                        checkGroup.checked = false
                    }
                })

                //Busca el elemento para des-checkear y demostrar que todos los dispositivos de ese tipo están des-checkeados
                this.elements.forEach( element => {
                    let checkElement = document.getElementById(`location-${ location.id }-element-${ element.id }`)
                    if (checkElement) {
                        checkElement.checked = false
                    }
                })
            },
            addDevices (location) {
                //Verificando si se seleccionó almenos un dispositivo de la ubicación seleccionada 
                //para agregar al cronograma
                let result = location.devices.find(device => {
                    return device.checked == true
                })

                if (!result) {
                    return this.$toastr.error(`No ha seleccionado ningún dispositivo para la ubicación: ${ location.name }`)
                }
                
                //Cambia la propiedad a added a true para mostrar que los dispositivos seleccionados de esa
                //ubicación ya se agregaron al listado del cronograma
                location.added = true

                //Recorre los dispositivos de la ubicación seleccionada y al que tiene
                //la propiedad checked true lo agrega al listado de dispositivos seleccionados 
                //para programar
                location.devices.forEach( device => {
                    if (device.checked == true) {
                        this.devicesSelected.push(device)
                    }
                })
                this.assignMonthToDevices()
            },
            assignMonthToDevices () {
                //Obteniendo arreglo con los meses que se checkearon para armar el cronograma
                let monthsSelected = this.months.filter(month => {
                        return month.state == true
                })

                //Si no se seleccionó ningún mes se quita el mes asignado a 
                //los dispositivos programados
                if (monthsSelected.length == 0) {
                    this.devicesSelected.forEach(device => {
                        device.month = { name: '', date: '', state: '' }
                    })
                }
                
                //Calculando la cantidad de dispositivos que se programarán para cada mes
                this.devicesForMonth = Math.ceil(this.devicesSelected.length / monthsSelected.length)
                if (this.devicesForMonth == 0) {
                    this.devicesForMonth = 1 //
                }             

                //Recorriendo cada mes para asgnarle el mes correpondiente                
                //de mantenimiento a cada dispositivo que se seleccionó anteriormente
                let count = 0
                monthsSelected.forEach( month => {
                    let multi = this.devicesForMonth + count
                    for (let i = count; i < multi; i++) {
                        //Verificando si todavía hay dispositivos sin asignar mes 
                        //y asignándoles uno
                        if (this.devicesSelected[i]) {
                            this.devicesSelected[i].month = month
                        }
                    }
                    count = count + this.devicesForMonth
                })

                //Verifica si quedaron dispositivos sin asignar fecha
                //para agregarles la del último mes
                this.devicesSelected.forEach( device => {
                    if (!device.month) {
                        device.month = monthsSelected[monthsSelected.length-1]
                    }
                })
            },
            deleteDevices (location) {
                location.added = false

                this.devicesSelected = this.devicesSelected.filter( device => {
                    return device.location_id != location.id
                })
                this.keysFromDeviceThatAreScheduled = []
                this.assignMonthToDevices()
            },
            selectDevices (location, elementId) {
                let isCheckedElement = document.getElementById(`location-${ location.id }-element-${ elementId }`).checked
                location.devices.forEach( device => {
                    if (device.element_id == elementId) {
                        if (isCheckedElement) {
                            device.checked = true
                        } else {
                            device.checked = false
                        }
                    }
                })
            },
            selectDevicesFromThatGroup (location, groupId) {
                let isCheckedGroup = document.getElementById(`location-${ location.id }-group-${ groupId }`).checked
                location.devices.forEach( device => {
                    if (device.group_id == groupId) {
                        if (isCheckedGroup) {
                            device.checked = true
                        } else {
                            device.checked = false
                        }
                    }
                })
            },
            thereAreDevicesFromThatElement (location, elementId) {
                return location.devices.find( device => {
                    return device.element_id == elementId
                })
            },
            thereAreDevicesFromThatGroup (location, groupId) {
                return location.devices.find( device => {
                    return device.group_id == groupId
                })
            },
            save () {
                this.saving = true
                let uri = `schedule-maintenances`
                let deviceSelectedMapped = this.devicesSelected.map( device => {
                    return { device_id: device.id, date: device.month.date }
                })
                let data = {
                    'nameOfSchedule': this.nameOfSchedule,
                    'yearOfSchedule': this.yearOfSchedule,
                    'devices': deviceSelectedMapped
                }

                //Verificando que la fecha esté diligenciada, 
                //Nota: Ya se está validando desde el backedn, es por esteticidad
                let devicesWithoutDate = data.devices.find( device => {
                    return device.date == ''
                })

                if (devicesWithoutDate) {
                    this.saving = false
                    this.$toastr.error('Hay fechas sin diligenciar')
                } else {
                    this.$http.post(uri, data).then(response => {
                        this.saving = false
                        this.$router.push({ name: 'schedule_maintenance.index' })
                    }).catch(error => {
                        this.saving = false
                        if (error.response.status == 422) {
                            
                            this.errors = error.response.data.errors
                            if (error.response.data.errors.keysFromDeviceThatAreScheduled) {
                                this.keysFromDeviceThatAreScheduled = error.response.data.errors.keysFromDeviceThatAreScheduled
                                delete this.errors.keysFromDeviceThatAreScheduled
                            }
                        }
                    })
                }
            },
            deviceIsScheduled (deviceId) {
                let deviceIsScheduled = this.keysFromDeviceThatAreScheduled.filter(key => {
                    return key == deviceId
                }).length

                if (deviceIsScheduled) {
                    return true
                }
                
                return false
            },
            deleteDeviceFromDeviceSelected (index) {
                this.devicesSelected.splice(index, 1)
                this.assignMonthToDevices()
            },
            showFormsForStartSchedule () {
                this.setMonths()
                this.showFormsForSchedule = true
            },
            setMonths () {
                this.months = [
                    { name: 'Enero', date: `${this.yearOfSchedule}-01-01`, state: true },
                    { name: 'Febrero', date: `${this.yearOfSchedule}-02-01`, state: true },
                    { name: 'Marzo', date: `${this.yearOfSchedule}-03-01`, state: true },
                    { name: 'Abril', date: `${this.yearOfSchedule}-04-01`, state: true },
                    { name: 'Mayo', date: `${this.yearOfSchedule}-05-01`, state: true },
                    { name: 'Junio', date: `${this.yearOfSchedule}-06-01`, state: true },
                    { name: 'Julio', date: `${this.yearOfSchedule}-07-01`, state: true },
                    { name: 'Agosto', date: `${this.yearOfSchedule}-08-01`, state: true },
                    { name: 'Septiembre', date: `${this.yearOfSchedule}-09-01`, state: true },
                    { name: 'Octubre', date: `${this.yearOfSchedule}-10-01`, state: true },
                    { name: 'Noviembre', date: `${this.yearOfSchedule}-11-01`, state: true },
                    { name: 'Diciembre', date: `${this.yearOfSchedule}-12-01`, state: true}
                ]
            },
            undoSchedule () {
                this.dataToCreateScheduleMaintenance = []
                this.nameOfSchedule = ''
                this.yearOfSchedule = ''
                this.devicesSelected = []
                this.groups = []
                this.elements = []
                this.months = []
                this.devicesForMonth = 0
                this.keysFromDeviceThatAreScheduled = []
                this.showFormsForSchedule = false
                this.errors = {}
                this.getDataToCreateScheduleMaintenance()
            }
        },
        watch: {
            months:{
                deep: true,
                handler () {
                    this.assignMonthToDevices()
                    if (this.devicesSelected.length == 0) {
                        this.devicesForMonth = 0
                    }
                }
            },
            devicesSelected () {
                if (this.devicesSelected.length == 0) {
                        this.devicesForMonth = 0
                }
            }
        },
    }
</script>