interface FormDataValue {
	uri: string;
	name?: string;
	type?: string;
}

interface FormData {
	append(name: string, value: FormDataValue | string): void;
}
