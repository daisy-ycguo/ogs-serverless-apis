Install:
1. ./deploy_pcloud.sh --install
2. ./deploy_counter.sh --install



Invoke:
1. wsk action invoke /whisk.system/pcloud/pcloud-get -i --result
2. wsk action invoke /whisk.system/counter/counter-inc1 -i -p names "'a','b','c'" --result
3. wsk action invoke /whisk.system/counter/counter-get -i -p name a --result



Uninstall:
1. ./deploy_pcloud.sh --uninstall
2. ./deploy_counter.sh --uninstall

