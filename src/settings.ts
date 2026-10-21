/** Strict, independent game preferences; browser persistence is added separately. */
export const choices={ghost:['hide','dynamic','show'],hardDrop:['off','on'],preview:['off','on'],hardLock:['general','immediate'],lock:['failed','delay'],hold:['off','on']} as const;
export type SettingKey=keyof typeof choices;
export type Settings={[K in SettingKey]:typeof choices[K][number]};
export const defaults:Settings={ghost:'show',hardDrop:'on',preview:'on',hardLock:'general',lock:'delay',hold:'on'};
export const keys=Object.keys(choices) as SettingKey[];
export function validSetting<K extends SettingKey>(key:K,value:string):value is Settings[K] {
 return (choices[key] as readonly string[]).includes(value);
}
export function setSetting<K extends SettingKey>(settings:Settings,key:K,value:string){
 if(!validSetting(key,value))return false;
 settings[key]=value;return true;
}

export const labels:Record<SettingKey,string>={ghost:'Ghost visibility',hardDrop:'Hard drop',preview:'Next-piece preview',hardLock:'Hard-drop locking policy',lock:'General locking policy',hold:'Hold piece'};
export const optionLabels:Record<string,string>={hide:'Always hide',dynamic:'Hide above midline',show:'Always show',off:'Off',on:'On',general:'Use general policy',immediate:'Lock immediately',failed:'Failed downward attempt',delay:'Full gravity interval'};
