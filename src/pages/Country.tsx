import type { Continent, Countries, CountriesArray } from '@/utils/types';

import React, { RefObject, useEffect, useRef, useState } from 'react';

import { getSelectedCountry } from '@/api/restCountryApi';
import { Flag } from '@/components/flag';
import style from '@/styles/country.module.scss';

export const Country = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [countries, setCountries] = useState<CountriesArray[]>([[], [], []]);

	interface elementType {
		[key: string]: RefObject<HTMLDivElement>;
	}
	const element: elementType = {
		animatiedContainer0: useRef<HTMLDivElement>(null),
		animatiedContainer1: useRef<HTMLDivElement>(null),
		animatiedContainer2: useRef<HTMLDivElement>(null),
	};

	const CountryApi = async (continent: Continent = 'Asia') => {
		setLoading(true);

		try {
			const data = await getSelectedCountry(continent);
			setCountries(data);
		} catch (err) {
			console.log(err);
		}
		for (let i = 0; i < 3; i++) {
			const target = element[`animatiedContainer${i}`].current;
			if (target) {
				setTimeout(() => {
					console.dir(target);
					const scrollLeft = getCenter(target.scrollWidth);
					target.scrollLeft = scrollLeft;
					target.scrollTo({ left: scrollLeft });
				}, 20);
			} else console.log('no target');
		}

		setLoading(false);
	};

	const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const continent = e.target.value as Continent;
		CountryApi(continent);
	};

	const getCenter = (scrollWidth: number) => (scrollWidth - 60) / 2;
	const getMidPointsLeft = (scrollWidth: number) => (scrollWidth + 30) / 3;
	const getMidPointsRight = (scrollWidth: number) => ((scrollWidth + 30) / 3) * 2;

	const scrollAnimation = () => {
		const speed = 3;
		setInterval(() => {
			for (let i = 0; i < 3; i++) {
				const target = element[`animatiedContainer${i}`].current;
				if (target) {
					if (i % 2 === 0) {
						target.scrollTo({
							left: target.scrollLeft + speed,
						});
					} else {
						target.scrollTo({
							left: target.scrollLeft - speed,
						});
					}
				}
			}
		}, 30);
	};

	const onscroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget;
		const scrollWidth = target.scrollWidth;
		// console.log(`${target.id}: ${scrollWidth} | ${target.scrollLeft}`);

		if (target.scrollLeft >= getMidPointsRight(scrollWidth))
			target.scrollTo({ left: getMidPointsLeft(scrollWidth) + 2 });
		else if (target.scrollLeft <= getMidPointsLeft(scrollWidth))
			target.scrollTo({ left: getMidPointsRight(scrollWidth) - 2 });
	};

	useEffect(() => {
		CountryApi();
		scrollAnimation();
	}, []);

	return (
		<div className="wrapper">
			<div className="question">Please choose a country to travel</div>
			<select className={style.select} onChange={handleChangeSelect}>
				<option value="Asia">Asia</option>
				<option value="Europe">Europe</option>
				<option value="Africa">Africa</option>
				<option value="Oceania">Oceania</option>
				<option value="Americas">Americas</option>
			</select>
			<div className={style.flags}>
				{countries.map((item, idx) => (
					<div
						id={`${idx}`}
						className={style.animatedContainer}
						onScroll={onscroll}
						ref={element[`animatiedContainer${idx}`]}
						key={idx}
					>
						{item.map((country: Countries, idx) => (
							<Flag data={country} key={idx} />
						))}
					</div>
				))}
			</div>
			<div className="loading">{loading ? 'loading' : 'success'}</div>
		</div>
	);
};
