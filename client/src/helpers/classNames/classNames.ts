type Objects = Record<string, string | boolean>;

export function classNames(
  clsx: string,
  arrayClsx: string[] = [],
  objectClsx: Objects = {},
) {
  return [
    clsx,
    ...arrayClsx.filter(Boolean),
    ...Object.entries(objectClsx)
      .filter(([_, value]) => Boolean(value))
      .map(([className]) => className),
  ].filter(Boolean).join(' ');
}
