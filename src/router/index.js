import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login.vue'
import Main from '../views/main/Main.vue'
import Dashboard from '../views/main/Dashboard.vue'
import GroupIndex from '../views/main/groups/Index.vue'
import GroupCreate from '../views/main/groups/Create.vue'
import GroupEdit from '../views/main/groups/Edit.vue'
import GroupAuthorization from '../views/main/groups/Authorization.vue'
import ElementIndex from '../views/main/elements/Index.vue'
import ElementCreate from '../views/main/elements/Create.vue'
import ElementEdit from '../views/main/elements/Edit.vue'
import LocationIndex from '../views/main/locations/Index.vue'
import LocationCreate from '../views/main/locations/Create.vue'
import LocationEdit from '../views/main/locations/Edit.vue'
import DependenceIndex from '../views/main/dependences/Index.vue'
import DependenceCreate from '../views/main/dependences/Create.vue'
import DependenceEdit from '../views/main/dependences/Edit.vue'
import ResponsibleIndex from '../views/main/responsibles/Index.vue'
import ResponsibleCreate from '../views/main/responsibles/Create.vue'
import ResponsibleEdit from '../views/main/responsibles/Edit.vue'
import BrandIndex from '../views/main/brands/Index.vue'
import BrandCreate from '../views/main/brands/Create.vue'
import BrandEdit from '../views/main/brands/Edit.vue'
import DeviceIndex from '../views/main/devices/Index.vue'
import DeviceCreate from '../views/main/devices/Create.vue'
import DeviceEdit from '../views/main/devices/Edit.vue'
import DeviceShow from '../views/main/devices/Show.vue'
//import DeviceUpdatePhoto from '../views/main/devices/UpdatePhoto.vue'
import DeviceMovementCreate from '../views/main/devices/movements/Create.vue'
import DevicePreventiveMaintenanceCreate from '../views/main/devices/preventive_maintenances/Create.vue'
import DevicePreventiveMaintenanceEdit from '../views/main/devices/preventive_maintenances/Edit.vue'
import TypeOtherMaintenanceIndex from '../views/main/type_other_maintenances/Index.vue'
import TypeOtherMaintenanceCreate from '../views/main/type_other_maintenances/Create.vue'
import TypeOtherMaintenanceEdit from '../views/main/type_other_maintenances/Edit.vue'
import DeviceOtherMaintenanceCreate from '../views/main/devices/other_maintenances/Create.vue'
import DeviceOtherMaintenanceEdit from '../views/main/devices/other_maintenances/Edit.vue'
import DeviceDocumentCreate from '../views/main/devices/documents/Create.vue'
import DeviceDownCreate from '../views/main/devices/down_device/Create.vue'
import DownDeviceIndex from '../views/main/down-devices/Index.vue'
import ScheduleMaintenanceIndex from '../views/main/schedule_maintenance/Index.vue'
import ScheduleMaintenanceCreate from '../views/main/schedule_maintenance/Create.vue'
import ScheduleMaintenanceShow from '../views/main/schedule_maintenance/Show.vue'
import ReplacementIndex from '../views/main/replacements/Index.vue'
import ReplacementCreate from '../views/main/replacements/Create.vue'
import ReplacementEdit from '../views/main/replacements/Edit.vue'

import ReportReplacement from '../views/main/reports/Replacement.vue'
import ReportMaintenance from '../views/main/reports/Maintenance.vue'

import PeriodsIndex from '../views/main/periods/Index.vue'
import PeriodsCreate from '../views/main/periods/Create.vue'
import PeriodsEdit from '../views/main/periods/Edit.vue'

import MaintenanceCreate from '../views/main/maintenances/Create.vue'

import UserIndex from '../views/main/users/Index.vue'
import UserCreate from '../views/main/users/Create.vue'
import UserEdit from '../views/main/users/Edit.vue'
import UserPermission from '../views/main/users/Permission.vue'
import CompanyIndex from '../views/main/company/Index.vue'

import TypeDocumentIndex from '../views/main/type_documents/Index.vue'
import TypeDocumentCreate from '../views/main/type_documents/Create.vue'
import TypeDocumentEdit from '../views/main/type_documents/Edit.vue'

import FailureModeIndex from '../views/main/failure_modes/Index.vue'
import FailureModeCreate from '../views/main/failure_modes/Create.vue'
import FailureModeEdit from '../views/main/failure_modes/Edit.vue'

import DevicePhotographicRecordUpdate from '../views/main/devices/photographic_record/Index.vue'

import ChecklistIndex from '../views/main/checklists/Index.vue'
import ChecklistEdit from '../views/main/checklists/Edit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/iniciar-sesion',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    
    component: Main,
    children: [
      {
        path: '/',
        name: 'main',
        component: Dashboard
      },
      {
        path: 'grupos',
        name: 'groups.index',
        component: GroupIndex
      },
      {
        path: 'grupos/nuevo',
        name: 'groups.create',
        component: GroupCreate
      },
      {
        path: 'grupos/:id/editar',
        name: 'groups.edit',
        component: GroupEdit
      },
      {
        path: 'grupos/:id/autorizacion',
        name: 'groups.authorization',
        component: GroupAuthorization
      },
      {
        path: 'elementos',
        name: 'elements.index',
        component: ElementIndex
      },
      {
        path: 'elementos/nuevo',
        name: 'elements.create',
        component: ElementCreate
      },
      {
        path: 'elementos/:id/editar',
        name: 'elements.edit',
        component: ElementEdit
      },
      {
        path: 'ubicaciones',
        name: 'locations.index',
        component: LocationIndex
      },
      {
        path: 'ubicaciones/nuevo',
        name: 'locations.create',
        component: LocationCreate
      },
      {
        path: 'ubicaciones/:id/editar',
        name: 'locations.edit',
        component: LocationEdit
      },
      {
        path: 'dependencias',
        name: 'dependences.index',
        component: DependenceIndex
      },
      {
        path: 'dependencias/nuevo',
        name: 'dependences.create',
        component: DependenceCreate
      },
      {
        path: 'dependencias/:id/editar',
        name: 'dependences.edit',
        component: DependenceEdit
      },
      {
        path: 'responsables',
        name: 'responsibles.index',
        component: ResponsibleIndex
      },
      {
        path: 'responsables/nuevo',
        name: 'responsibles.create',
        component: ResponsibleCreate
      },
      {
        path: 'responsables/:id/editar',
        name: 'responsibles.edit',
        component: ResponsibleEdit
      },
      {
        path: 'marcas',
        name: 'brands.index',
        component: BrandIndex
      },
      {
        path: 'marcas/nuevo',
        name: 'brands.create',
        component: BrandCreate
      },
      {
        path: 'marcas/:id/editar',
        name: 'brands.edit',
        component: BrandEdit
      },
      {
        path: 'dispositivos',
        name: 'devices.index',
        component: DeviceIndex
      },
      {
        path: 'dispositivos/nuevo',
        name: 'devices.create',
        component: DeviceCreate
      },
      {
        path: 'dispositivos/:id/editar',
        name: 'devices.edit',
        component: DeviceEdit
      },
      {
        path: 'dispositivos/:id',
        name: 'devices.show',
        component: DeviceShow
      },
      {
        path: 'dispositivos/:id/actualizar-registro-fotografico',
        name: 'devices.photographicRecordUpdate',
        component: DevicePhotographicRecordUpdate
      },
      {
        path: 'dispositivos/:id/movimientos/nuevo',
        name: 'devices.movements.create',
        component: DeviceMovementCreate
      },
      {
        path: 'dispositivos/:id/mantenimientos-preventivos/nuevo',
        name: 'devices.preventive_maintenances.create',
        component: DevicePreventiveMaintenanceCreate
      },
      {
        path: 'dispositivos/:idPreventiveMaintenance/mantenimientos-preventivos/editar',
        name: 'devices.preventive_maintenances.edit',
        component: DevicePreventiveMaintenanceEdit
      },
      /*{
        path: 'dispositivos/:id/registro-fotografico',
        name: 'devices.updatePhoto',
        component: DeviceUpdatePhoto
      },*/
      {
        path: 'clasificacion-de-servicios',
        name: 'type_other_maintenances.index',
        component: TypeOtherMaintenanceIndex
      },
      {
        path: 'clasificacion-de-servicios/nuevo',
        name: 'type_other_maintenances.create',
        component: TypeOtherMaintenanceCreate
      },
      {
        path: 'clasificacion-de-servicios/:id/editar',
        name: 'type_other_maintenances.edit',
        component: TypeOtherMaintenanceEdit
      },
      {
        path: 'dispositivos/:id/otros-mantenimientos/nuevo',
        name: 'devices.other_maintenances.create',
        component: DeviceOtherMaintenanceCreate
      },
      {
        path: 'dispositivos/:idOtherMaintenance/otros-mantenimientos/editar',
        name: 'devices.other_maintenances.edit',
        component: DeviceOtherMaintenanceEdit
      },
      {
        path: 'dispositivos/:id/documentos/nuevo',
        name: 'devices.documents.create',
        component: DeviceDocumentCreate
      },
      {
        path: 'dispositivos/:id/dar-de-baja',
        name: 'devices.down.create',
        component: DeviceDownCreate
      },
      {
        path: 'dispositivos-dados-de-baja',
        name: 'down-devices.index',
        component: DownDeviceIndex
      },
      {
        path: 'cronogramas-de-mantenimiento',
        name: 'schedule_maintenance.index',
        component: ScheduleMaintenanceIndex
      },
      {
        path: 'cronogramas-de-mantenimiento/nuevo',
        name: 'schedule_maintenance.create',
        component: ScheduleMaintenanceCreate
      },
      {
        path: 'cronogramas-de-mantenimiento/:id',
        name: 'schedule_maintenance.show',
        component: ScheduleMaintenanceShow
      },
      {
        path: 'repuestos-consumibles',
        name: 'replacements.index',
        component: ReplacementIndex
      },
      {
        path: 'repuestos-consumibles/nuevo',
        name: 'replacements.create',
        component: ReplacementCreate
      },
      {
        path: 'repuestos-consumibles/:id/editar',
        name: 'replacements.edit',
        component: ReplacementEdit
      },
      {
        path: 'repuestos-usados',
        name: 'reports.replacements',
        component: ReportReplacement
      },
      {
        path: 'mantenimientos',
        name: 'reports.maintenances',
        component: ReportMaintenance
      },
      {
        path: 'periodos-de-mantenimiento',
        name: 'periods.index',
        component: PeriodsIndex
      },
      {
        path: 'periodos-de-mantenimiento/nuevo',
        name: 'periods.create',
        component: PeriodsCreate
      },
      {
        path: 'periodos-de-mantenimiento/:id/editar',
        name: 'periods.edit',
        component: PeriodsEdit
      },
      {
        path: 'mantenimientos-generales/nuevo',
        name: 'maintenances.create',
        component: MaintenanceCreate
      },
      {
        path: 'usuarios',
        name: 'users.index',
        component: UserIndex
      },
      {
        path: 'usuarios/nuevo',
        name: 'users.create',
        component: UserCreate
      },
      {
        path: 'usuarios/:id/editar',
        name: 'users.edit',
        component: UserEdit
      },
      {
        path: 'usuarios/:id/permisos',
        name: 'users.permissions',
        component: UserPermission
      },
      {
        path: 'company',
        name: 'company.index',
        component: CompanyIndex
      },
      {
        path: 'tipos-de-documentos',
        name: 'typeDocuments.index',
        component: TypeDocumentIndex
      },
      {
        path: 'tipos-de-documentos/nuevo',
        name: 'typeDocuments.create',
        component: TypeDocumentCreate
      },
      {
        path: 'tipos-de-documentos/:id/editar',
        name: 'typeDocuments.edit',
        component: TypeDocumentEdit
      },
      {
        path: 'modos-de-falla',
        name: 'failureModes.index',
        component: FailureModeIndex
      },
      {
        path: 'modos-de-falla/nuevo',
        name: 'failureModes.create',
        component: FailureModeCreate
      },
      {
        path: 'modos-de-falla/:id/editar',
        name: 'failureModes.edit',
        component: FailureModeEdit
      },
      {
        path: 'listas-de-chequeo',
        name: 'checklists.index',
        component: ChecklistIndex
      },
      {
        path: 'listas-de-chequeo/:id/editar',
        name: 'checklists.edit',
        component: ChecklistEdit
      },
    ]
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !localStorage.getItem('access_token')) next({ name: 'login' })
  if (to.name == 'login' && localStorage.getItem('access_token')) next({ name: 'main.index' })
  else next()
})

export default router
