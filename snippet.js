//////////////////////////////////////////////////
//                    INPUTS                    //
//////////////////////////////////////////////////

/*

vraIaasHost (Type = vCAC:VCACHost)
dataCenterLocationName (Type = string) 

*/

//////////////////////////////////////////////////
//                    OUTPUT                    //
//////////////////////////////////////////////////

/*

Return type = Array/vCAC:HostMachine

*/

// Filter used for searching in the Hosts "table" of the vRA IaaS SQL Database
var filter = "IsVRMManaged eq true and ManagementEndpoint/InterfaceType eq 'vSphere'";

// Search Hosts "table" in the vRA IaaS SQL Database, using above filter
var hostEntities = vCACEntityManager.readModelEntitiesBySystemQuery(vraIaasHost.id , "ManagementModelEntities.svc" , "Hosts" , filter);

// Create empty array for collecting found Compute Resources
var dataCenterLocationComputeResources = new Array();

// Loop thru hostEntities, get their hostProperties, chceck of Property "Vrm.DataCenter.Location" is present, then check if value of that property matches the DataCenterLocation Name provided
for each (var hostEntity in hostEntities) {
	var hostPropertiesEntities = hostEntity.getLink(vraIaasHost, "HostProperties");
	for each (hostPropertiesEntity in hostPropertiesEntities) {
		if (hostPropertiesEntity.getProperty("PropertyName") == "Vrm.DataCenter.Location") {
			if (hostPropertiesEntity.getProperty("PropertyValue") == dataCenterLocationName) {
				dataCenterLocationComputeResources.push(hostEntity.getInventoryObject());
			}
		}
	}
}

return dataCenterLocationComputeResources;