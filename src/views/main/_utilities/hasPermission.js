export default {
    methods: {
        hasPermission (permission) {
            let results = JSON.parse(localStorage.getItem('permissions')).find(permissionDB =>  permissionDB.name == permission)
            return results ? true : false
        }
    }
}