set -x

cd "$(dirname $BASH_SOURCE)"

mkdir -p .micro-build/x/config-helper

cd .micro-build/x

unlink microbuild-config.d.ts
unlink microbuild-helper.d.ts
ln -s ../../../dist/library/microbuild-config.d.ts
ln -s ../../../dist/library/microbuild-helper.d.ts

cd config-helper

for i in * ; do
	unlink "$i"
done

for i in ../../../../dist/library/config-helper/*.d.ts ; do
	ln -s "$i"
done
